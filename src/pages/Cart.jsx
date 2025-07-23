import { useNavigate } from "react-router-dom";
import PageHeader from "../components/molecules/PageHeader";
import CartList from "../components/organisms/CartList";
import OrderSummary from "../components/molecules/OrderSummary";

const cartItems = [
  { id: 1, name: "Producto Premium", price: 99.99, quantity: 2, image: "📱" },
  { id: 2, name: "Accesorio Elegante", price: 49.99, quantity: 1, image: "⌚" },
  { id: 3, name: "Gadget Innovador", price: 79.99, quantity: 1, image: "🎧" }
];

const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const shipping = 9.99;
const total = subtotal + shipping;

export default function Cart() {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/store');
  };

  const handleConfirmPurchase = () => {
    navigate('/confirm');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Tu Carrito"
          subtitle="Revisa tus productos antes de continuar"
          icon="🛒"
        />

        <div className="max-w-4xl mx-auto">
          <CartList items={cartItems} />
          
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onContinueShopping={handleContinueShopping}
            onConfirmPurchase={handleConfirmPurchase}
          />
        </div>
      </div>
    </div>
  );
} 