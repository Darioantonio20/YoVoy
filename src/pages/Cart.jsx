import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/molecules/PageHeader";
import CartList from "../components/organisms/CartList";
import OrderSummary from "../components/molecules/OrderSummary";
import OrderConfirmationModal from "../components/molecules/OrderConfirmationModal";
import { useCartContext } from "../context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getSubtotal } = useCartContext();
  
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
    
    setShowOrderConfirmation(true);
    // No limpiar el carrito aquí, se limpiará cuando se cierre el modal
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
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Tu Carrito"
          subtitle="Revisa tus productos antes de continuar"
          icon="🛒"
        />

        <div className="max-w-4xl mx-auto">
          <CartList 
            items={cartItems} 
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
          
          <OrderSummary
            subtotal={getSubtotal()}
            shipping={shipping}
            total={total}
            onContinueShopping={handleContinueShopping}
            onConfirmPurchase={handleConfirmPurchase}
          />
        </div>
      </div>

      {/* Modal de confirmación de orden */}
      <OrderConfirmationModal
        isOpen={showOrderConfirmation}
        onClose={handleCloseOrderConfirmation}
        orderDetails={orderDetails}
      />
    </div>
  );
} 