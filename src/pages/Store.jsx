import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import PageHeader from "../components/molecules/PageHeader";
import ProductGrid from "../components/organisms/ProductGrid";

const products = [
  { id: 1, name: "Producto Premium", price: "$99.99", image: "📱", category: "Tecnología" },
  { id: 2, name: "Accesorio Elegante", price: "$49.99", image: "⌚", category: "Accesorios" },
  { id: 3, name: "Gadget Innovador", price: "$79.99", image: "🎧", category: "Audio" },
  { id: 4, name: "Herramienta Útil", price: "$29.99", image: "🔧", category: "Herramientas" },
  { id: 5, name: "Decoración Moderna", price: "$39.99", image: "🏠", category: "Hogar" },
  { id: 6, name: "Producto Exclusivo", price: "$149.99", image: "💎", category: "Premium" }
];

export default function Store() {
  const handleAddToCart = (product) => {
    console.log('Agregando al carrito:', product);
    // Aquí iría la lógica para agregar al carrito
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Nuestra Tienda"
          subtitle="Descubre nuestra colección de productos increíbles. Calidad garantizada en cada compra."
          icon="🛍️"
        />

        <ProductGrid products={products} onAddToCart={handleAddToCart} />

        <div className="text-center">
          <Link to="/cart">
            <Button className="text-lg px-8 py-4">
              🛒 Ver Carrito ({products.length} productos)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 