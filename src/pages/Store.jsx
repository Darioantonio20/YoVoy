import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import PageHeader from "../components/molecules/PageHeader";
import { ShoppingBag } from "lucide-react";
import ProductGrid from "../components/organisms/ProductGrid";
import Beams from "../components/organisms/Beams";

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado 3D */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <Beams
          beamWidth={1.1}
          beamHeight={21}
          beamNumber={26}
          lightColor="#ffffff"
          speed={3.9}
          noiseIntensity={2.9}
          scale={0.33}
          rotation={30}
        />
      </div>
      {/* Contenido principal */}
      <div className="container text-center mx-auto px-4 py-8 relative z-10">
        <PageHeader 
          title="Busca tus productos o antojos favoritos y añádelos al carrito"
          subtitle="Ordena, Pide, Compra y Yovoy se encarga de llevártelo."
          icon={<ShoppingBag size={32} className="inline-block align-middle text-orange-400 mr-2" />}
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