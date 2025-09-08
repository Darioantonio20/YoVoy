import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, MapPin, Star, ChevronDown, X } from 'lucide-react';
import PageHeader from '../components/molecules/PageHeader';
import CartList from '../components/organisms/CartList';
import OrderSummary from '../components/molecules/OrderSummary';
import PaymentMethodModal from '../components/molecules/PaymentMethodModal';
import OrderConfirmationModal from '../components/molecules/OrderConfirmationModal';
import BackgroundDecorator from '../components/atoms/BackgroundDecorator';
import Alert from '../components/atoms/Alert';
import Text from '../components/atoms/Text';
import Button from '../components/atoms/Button';
import { useCartContext } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { calculateDeliveryFee } from '../utils/deliveryPricing';
import { apiRequest, API_CONFIG } from '../config/api';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, updateNote, clearCart, getSubtotal, currentStoreId, originalProducts } =
    useCartContext();
  const { createOrderWithUserData, isLoading: orderLoading } = useOrders();
  const { user } = useAuth();

  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocations, setUserLocations] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

  // Cargar ubicaciones del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      loadUserLocations();
    }
  }, [user]);

  // Manejar redirección cuando el carrito está vacío
  useEffect(() => {
    if (cartItems.length === 0 && !showOrderConfirmation) {
      navigate('/store');
    }
  }, [cartItems.length, showOrderConfirmation, navigate]);

  // Función para cargar ubicaciones del usuario
  const loadUserLocations = async () => {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE, {
        method: 'GET',
      });

      if (response.success) {
        const userData = response.data.data;
        const locations = userData.locations || [];
        const currentIndex = userData.currentLocationIndex || 0;
        
        setUserLocations(locations);
        setCurrentLocationIndex(currentIndex);
        
        // Establecer la ubicación actual como seleccionada por defecto
        if (locations.length > 0) {
          setSelectedLocation(locations[currentIndex]);
        }
      }
    } catch (error) {
      console.error('Error loading user locations:', error);
    }
  };

  // Función para cambiar ubicación actual
  const handleSetCurrentLocation = async (locationId) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.AUTH.LOCATIONS.SET_CURRENT.replace(':id', locationId);
      const response = await apiRequest(endpoint, {
        method: 'PUT',
      });

      if (response.success) {
        const newIndex = response.data.data.currentLocationIndex;
        setCurrentLocationIndex(newIndex);
        setSelectedLocation(userLocations[newIndex]);
        await Alert.success('Ubicación Actual', 'La ubicación de entrega ha sido actualizada.');
      } else {
        await Alert.error('Error al Cambiar', response.data.message || 'No se pudo cambiar la ubicación actual.');
      }
    } catch (error) {
      console.error('Error setting current location:', error);
      await Alert.error('Error de Conexión', 'No se pudo conectar con el servidor.');
    }
  };

  const handleContinueShopping = () => {
    navigate('/store');
  };

  const handleConfirmPurchase = () => {
    // Verificar si el usuario está autenticado
    if (!user || !user._id) {
      Alert.confirm(
        'Inicia sesión requerido',
        'Para realizar tu compra necesitas iniciar sesión o crear una cuenta. ¿Te gustaría ir al login ahora?'
      ).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        }
      });
      return;
    }

    const deliveryInfo = calculateDeliveryFee();
    const shipping = cartItems.length > 0 ? deliveryInfo.totalFee : 0;
    const total = getSubtotal() + shipping;

    setOrderDetails({
      items: cartItems,
      subtotal: getSubtotal(),
      shipping,
      total,
      deliveryInfo,
    });

    setShowPaymentMethod(true);
  };

  const handlePaymentConfirm = async (paymentMethod) => {
    setShowPaymentMethod(false);
    
    try {
      // Preparar datos de la orden
      const deliveryInfo = calculateDeliveryFee();
      

      
      const orderData = {
        items: cartItems,
        paymentMethod: paymentMethod,
        paymentDetails: `Pago con ${paymentMethod}`,
        subtotal: getSubtotal(),
        shipping: deliveryInfo.totalFee,
        total: getSubtotal() + deliveryInfo.totalFee,
        storeId: currentStoreId,
        deliveryInfo: deliveryInfo
      };

      // Crear la orden
      const result = await createOrderWithUserData(orderData, user);
      
      if (result.success) {
        // Guardar los datos del carrito antes de limpiarlo
        const currentCartItems = [...cartItems];
        const currentSubtotal = getSubtotal();
        
        // Actualizar orderDetails con los datos de la orden creada
        const deliveryInfo = calculateDeliveryFee();
        setOrderDetails({
          items: currentCartItems,
          subtotal: currentSubtotal,
          shipping: deliveryInfo.totalFee,
          total: currentSubtotal + deliveryInfo.totalFee,
          orderNumber: result.data?.orderNumber || `#${Date.now()}`,
          orderId: result.data?.orderId || '',
          deliveryInfo: deliveryInfo
        });
        
        setShowOrderConfirmation(true);
        
        // Solo limpiar carrito, NO redirigir automáticamente
        setTimeout(async () => {
          await clearCart(false); // No mostrar alerta de carrito vaciado
        }, 100);
      } else {
        Alert.error('Error', result.message || 'No se pudo crear la orden');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.error('Error', 'Error al procesar la orden');
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentMethod(false);
    setOrderDetails(null);
  };

  const handleRemoveItem = productId => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  const handleCloseOrderConfirmation = () => {
    setShowOrderConfirmation(false);
    setOrderDetails(null);
    // Mostrar alerta de éxito y redirigir cuando el usuario confirma
    Alert.success(
      '¡Orden Creada!',
      'Tu orden se ha creado correctamente. Recibirás una confirmación con los detalles de tu pedido.'
    );
    navigate('/store');
  };

  const deliveryInfo = calculateDeliveryFee();
  const shipping = cartItems.length > 0 ? deliveryInfo.totalFee : 0;
  const total = getSubtotal() + shipping;

  // Usar useEffect para manejar la redirección de manera segura
  useEffect(() => {
    if (cartItems.length === 0 && !showOrderConfirmation) {
      navigate('/store');
    }
  }, [cartItems.length, showOrderConfirmation, navigate]);

  // Si no hay productos y no hay modal de confirmación abierto, mostrar loading
  if (cartItems.length === 0 && !showOrderConfirmation) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-white'>Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden'>
      <BackgroundDecorator />

      <div className='relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
        {/* Header con diseño mejorado */}
        <div className='mb-6 sm:mb-8'>
          <PageHeader
            title='Tu Carrito'
            subtitle='Revisa tus productos antes de continuar'
            icon='🛒'
            textColor='text-white'
          />
        </div>

        <div className='w-full'>
          {/* Layout mejorado con grid responsivo */}
          <div className='grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8'>
            {/* CartList - ocupa más espacio en desktop */}
            <div className='xl:col-span-8'>
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6'>
                <div className='mb-4 sm:mb-6'>
                  <h2 className='text-xl sm:text-2xl font-bold text-white mb-2 flex items-center'>
                    <span className='bg-gradient-to-r from-[#F9C81E] to-yellow-400 bg-clip-text text-transparent'>
                      Productos en tu carrito
                    </span>
                    <span className='ml-3 bg-gradient-to-r from-[#F9C81E] to-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full'>
                      {cartItems.length}
                    </span>
                  </h2>
                  <div className='w-20 h-1 bg-gradient-to-r from-[#F9C81E] to-yellow-500 rounded-full'></div>
                </div>

                <CartList
                  items={cartItems}
                  onRemoveItem={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onUpdateNote={updateNote}
                  originalProducts={originalProducts}
                />
              </div>
            </div>

            {/* OrderSummary - sidebar en desktop */}
            <div className='xl:col-span-4'>
              <div className='sticky top-4 space-y-6'>
                {/* Selector de ubicación */}
                {user && userLocations.length > 0 && (
                  <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6'>
                    <div className='mb-4'>
                      <h3 className='text-lg font-bold text-white mb-2 flex items-center'>
                        <MapPin className='w-5 h-5 text-[#F9C81E] mr-2' />
                        <span className='bg-gradient-to-r from-[#F9C81E] to-yellow-400 bg-clip-text text-transparent'>
                          Ubicación de entrega
                        </span>
                      </h3>
                      <div className='w-16 h-1 bg-gradient-to-r from-[#F9C81E] to-yellow-500 rounded-full'></div>
                    </div>

                    {/* Ubicación actual */}
                    <div className='mb-4'>
                      <div className='flex items-center justify-between p-3 bg-[#F9C81E]/20 border border-[#F9C81E]/30 rounded-lg'>
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-4 h-4 text-[#F9C81E]' />
                          <div>
                            <Text variant='bodyBold' size='sm' className='text-[#F9C81E]'>
                              {selectedLocation?.alias || 'Sin ubicación'}
                            </Text>
                            <Text variant='caption' size='xs' className='text-[#F9C81E]/70 truncate'>
                              {selectedLocation?.googleMapsUrl || ''}
                            </Text>
                          </div>
                        </div>
                        <Star className='w-4 h-4 text-[#F9C81E]' fill='currentColor' />
                      </div>
                    </div>

                    {/* Botón para cambiar ubicación */}
                    {userLocations.length > 1 && (
                      <Button
                        onClick={() => setShowLocationSelector(true)}
                        variant='secondary'
                        className='w-full flex items-center justify-center gap-2'
                      >
                        <ChevronDown className='w-4 h-4' />
                        Cambiar ubicación
                      </Button>
                    )}
                  </div>
                )}

                {/* Resumen de compra */}
                <div className='bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8'>
                  <div className='mb-6'>
                    <h3 className='text-xl font-bold text-white mb-2 flex items-center'>
                      <span className='bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>
                        Resumen de compra
                      </span>
                    </h3>
                    <div className='w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full'></div>
                  </div>

                  <OrderSummary
                    subtotal={getSubtotal()}
                    shipping={shipping}
                    total={total}
                    onContinueShopping={handleContinueShopping}
                    onConfirmPurchase={handleConfirmPurchase}
                    isLoading={orderLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de métodos de pago */}
      <PaymentMethodModal
        isOpen={showPaymentMethod}
        onClose={handlePaymentClose}
        onConfirm={handlePaymentConfirm}
        orderDetails={orderDetails}
      />

      {/* Modal de selección de ubicación */}
      {showLocationSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F9C81E] to-[#F9C81E] rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <Text variant="h3" size="base" className="text-white">Seleccionar Ubicación</Text>
              </div>
              <Button onClick={() => setShowLocationSelector(false)} variant="minimal" className="p-2 text-[#F9C81E] hover:bg-gray-700 border-none bg-transparent">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Lista de ubicaciones */}
            <div className="space-y-3">
              {userLocations.map((location, index) => (
                <div
                  key={location._id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                    index === currentLocationIndex
                      ? 'bg-[#F9C81E]/20 border-[#F9C81E]/30' 
                      : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                  }`}
                  onClick={() => handleSetCurrentLocation(location._id)}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 flex-shrink-0 self-center ${index === currentLocationIndex ? 'text-[#F9C81E]' : 'text-[#F9C81E]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <Text variant="body" size="sm" className={`font-medium ${index === currentLocationIndex ? 'text-[#F9C81E]' : 'text-white'}`}>
                            {location.alias}
                          </Text>
                          {index === currentLocationIndex && (
                            <Star className="w-3 h-3 text-[#F9C81E]" fill="currentColor" />
                          )}
                        </div>
                        <Text variant="body" size="xs" className="text-white/70 truncate">
                          {location.googleMapsUrl}
                        </Text>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicador de selección */}
                  <div className="flex items-center gap-1 self-center">
                    {index === currentLocationIndex && (
                      <div className="w-3 h-3 bg-[#F9C81E] rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de cerrar */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={() => setShowLocationSelector(false)}
                variant="secondary"
                className="w-full"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de orden */}
      <OrderConfirmationModal
        isOpen={showOrderConfirmation}
        onClose={handleCloseOrderConfirmation}
        orderDetails={orderDetails}
      />
    </div>
  );
}
