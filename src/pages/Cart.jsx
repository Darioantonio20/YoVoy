import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/molecules/PageHeader';
import CartList from '../components/organisms/CartList';
import OrderSummary from '../components/molecules/OrderSummary';
import PaymentMethodModal from '../components/molecules/PaymentMethodModal';
import OrderConfirmationModal from '../components/molecules/OrderConfirmationModal';
import BackgroundDecorator from '../components/atoms/BackgroundDecorator';
import Alert from '../components/atoms/Alert';
import { useCartContext } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, updateNote, clearCart, getSubtotal } =
    useCartContext();

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
    const shipping = cartItems.length > 0 ? 9.99 : 0;
    const total = getSubtotal() + shipping;

    setOrderDetails({
      items: cartItems,
      subtotal: getSubtotal(),
      shipping,
      total,
    });

    setShowPaymentMethod(true);
  };

  const handlePaymentConfirm = paymentMethod => {
    setShowPaymentMethod(false);
    setShowOrderConfirmation(true);
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
    clearCart(); // Limpiar el carrito aquí
    // Mostrar alerta de compra enviada
    Alert.success(
      '¡Compra Enviada!',
      'Tu compra se ha enviado a la tienda. Recibirás una llamada de confirmación con los detalles de tu pedido.'
    );
    navigate('/store');
  };

  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const total = getSubtotal() + shipping;

  // Si no hay productos, mostrar loading o nada mientras se redirige
  if (cartItems.length === 0) {
    return null;
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
