import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import PageHeader from "../components/molecules/PageHeader";
import { ShoppingBag } from "lucide-react";
import ProductGrid from "../components/organisms/ProductGrid";
import Beams from "../components/organisms/Beams";
import StoreCard from "../components/molecules/StoreCard";
import Text from "../components/atoms/Text";
import Spinner from "../components/atoms/Spinner";
import useSpinner from "../hooks/useSpinner";
import storesData from "../data/stores.json";

export default function Store() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [category, setCategory] = useState("");
  const { isLoading } = useSpinner(1500);

  const filteredStores = storesData.stores.filter(store =>
    store.category.toLowerCase().includes(category.toLowerCase()) ||
    store.name.toLowerCase().includes(category.toLowerCase())
  );

  const products = selectedStore
    ? storesData.products.filter(p => p.storeId === selectedStore.id)
    : [];

  const handleAddToCart = (product) => {
    console.log('Agregando al carrito:', product);
    // Aquí iría la lógica para agregar al carrito
  };

  return (
    <>
      {isLoading && <Spinner message="Cargando tiendas y productos..." />}
      <div className="relative min-h-screen overflow-hidden">
        {/* Fondo animado 3D */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          <Beams
            beamWidth={1.1}
            beamHeight={6}
            beamNumber={6}
            lightColor="#ffffff"
            speed={0.5}
            noiseIntensity={1}
            scale={0.3}
            rotation={30}
          />
        </div>
        {/* Contenido principal */}
        <div className="container text-center mx-auto px-4 py-8 relative z-10">
          <PageHeader 
            title={selectedStore ? selectedStore.name : "Busca tu tienda favorita por categoría"}
            subtitle={selectedStore ? "Elige tus productos y añádelos al carrito" : "Filtra por categoría o nombre de tienda para encontrar lo que buscas."}
            icon={<ShoppingBag size={32} className="inline-block align-middle text-orange-400 mr-2" />}
          />
          {!selectedStore && (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="Buscar por categoría o nombre de tienda..."
                  className="w-full sm:w-80 px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Button variant="fire" onClick={() => setCategory(category)}>
                  Buscar
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                {filteredStores.map(store => (
                  <StoreCard key={store.id} store={store} onSelect={setSelectedStore} />
                ))}
                {filteredStores.length === 0 && (
                  <Text className="col-span-full text-white/70">No se encontraron tiendas para esa búsqueda.</Text>
                )}
              </div>
            </>
          )}
          {selectedStore && (
            <>
              <Button variant="minimal" className="mb-6" onClick={() => setSelectedStore(null)}>
                ← Volver a tiendas
              </Button>
              <ProductGrid products={products} onAddToCart={handleAddToCart} />
              <div className="text-center">
                <Link to="/cart">
                  <Button className="text-lg px-8 py-4">
                    🛒 Ver Carrito ({products.length} productos)
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 