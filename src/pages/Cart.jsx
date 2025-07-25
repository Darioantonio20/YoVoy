import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/molecules/PageHeader";
import CartList from "../components/organisms/CartList";
import OrderSummary from "../components/molecules/OrderSummary";
import PaymentMethodModal from "../components/molecules/PaymentMethodModal";
import OrderConfirmationModal from "../components/molecules/OrderConfirmationModal";
import { useCartContext } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getSubtotal } = useCartContext();
  
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
      total
    });
    
    setShowPaymentMethod(true);
  };

  const handlePaymentConfirm = (paymentMethod) => {
    setShowPaymentMethod(false);
    setShowOrderConfirmation(true);
  };

  const handlePaymentClose = () => {
    setShowPaymentMethod(false);
    setOrderDetails(null);
  };

  const handleRemoveItem = (productId) => {
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
    alert("¡Tu compra se ha enviado a la tienda!");
    navigate('/store');
  };

  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const total = getSubtotal() + shipping;

  // Si no hay productos, mostrar loading o nada mientras se redirige
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <PageHeader 
          title="Tu Carrito"
          subtitle="Revisa tus productos antes de continuar"
          icon="🛒"
          textColor="text-blue-600"
        />

        <div className="max-w-4xl mx-auto">
          {/* Layout vertical: CartList arriba, OrderSummary abajo */}
          <div className="space-y-6 lg:space-y-8">
            {/* CartList - full width en todos los dispositivos */}
            <CartList 
              items={cartItems} 
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
            
            {/* OrderSummary - centrado en desktop */}
            <div className="flex justify-center">
              <div className="w-full max-w-md lg:max-w-lg">
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