import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import PageHeader from '../components/molecules/PageHeader';
import CartList from '../components/organisms/CartList';
import OrderSummary from '../components/molecules/OrderSummary';
import PaymentMethodModal from '../components/molecules/PaymentMethodModal';
import OrderConfirmationModal from '../components/molecules/OrderConfirmationModal';
import BackgroundDecorator from '../components/atoms/BackgroundDecorator';
import Alert from '../components/atoms/Alert';
import { useCartContext } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { calculateDeliveryFee } from '../utils/deliveryPricing';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, updateNote, clearCart, getSubtotal, currentStoreId, originalProducts } =
    useCartContext();
  const { createOrderWithUserData, isLoading: orderLoading } = useOrders();
  const { user } = useAuth();

  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Manejar redirección cuando el carrito está vacío
  useEffect(() => {
    if (cartItems.length === 0 && !showOrderConfirmation) {
      navigate('/store');
    }
  }, [cartItems.length, showOrderConfirmation, navigate]);

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
                    <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                      Productos en tu carrito
                    </span>
                    <span className='ml-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full'>
                      {cartItems.length}
                    </span>
                  </h2>
                  <div className='w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full'></div>
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
              <div className='sticky top-4'>
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

      {/* Modal de confirmación de orden */}
      <OrderConfirmationModal
        isOpen={showOrderConfirmation}
        onClose={handleCloseOrderConfirmation}
        orderDetails={orderDetails}
      />
    </div>
  );
}
