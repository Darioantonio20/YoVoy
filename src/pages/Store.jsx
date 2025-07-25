import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import PageHeader from "../components/molecules/PageHeader";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import ProductGrid from "../components/organisms/ProductGrid";
import StoreCard from "../components/molecules/StoreCard";
import Text from "../components/atoms/Text";
import Spinner from "../components/atoms/Spinner";
import SearchBar from "../components/atoms/SearchBar";
import FloatingCart from "../components/atoms/FloatingCart";
import useSpinner from "../hooks/useSpinner";
import { useCartContext } from "../context/CartContext";
import storesData from "../data/stores.json";

export default function Store() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStores, setSearchStores] = useState("");
  const [searchProducts, setSearchProducts] = useState("");
  const [currentView, setCurrentView] = useState("search"); // "search", "stores", "products"
  const { isLoading } = useSpinner(1500);
  const { addToCart, getTotalItems, cartItems, isInitialized } = useCartContext();

  // Obtener categorías únicas para el buscador
  const categories = [...new Set(storesData.stores.map(store => store.category))];
  
  // Filtrar categorías por búsqueda
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Filtrar tiendas por categoría buscada
  const storesInCategory = storesData.stores.filter(store =>
    store.category.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Filtrar tiendas por búsqueda adicional
  const filteredStores = storesInCategory.filter(store =>
    store.name.toLowerCase().includes(searchStores.toLowerCase()) ||
    store.description.toLowerCase().includes(searchStores.toLowerCase())
  );

  // Obtener productos de la tienda seleccionada
  const allProducts = selectedStore
    ? storesData.products.filter(p => p.storeId === selectedStore.id)
    : [];

  // Filtrar productos por búsqueda
  const products = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchProducts.toLowerCase()) ||
    product.description.toLowerCase().includes(searchProducts.toLowerCase())
  );

  const handleCategorySearch = (category) => {
    setSearchCategory(category);
    setCurrentView("stores");
    setSelectedStore(null);
    setSearchStores("");
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setCurrentView("products");
    setSearchProducts("");
  };

  const handleBackToStores = () => {
    setSelectedStore(null);
    setCurrentView("stores");
    setSearchProducts("");
  };

  const handleBackToSearch = () => {
    setSearchCategory("");
    setSelectedStore(null);
    setCurrentView("search");
    setSearchStores("");
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <>
      {isLoading && <Spinner message="Cargando tiendas y productos..." />}
      
      {/* Carrito flotante */}
      <FloatingCart itemCount={getTotalItems()} />
      
      <div className="relative min-h-screen bg-black">
        {/* Contenido principal */}
        <div className="container text-center mx-auto px-4 py-8 relative z-10">
          {/* Vista de búsqueda por categoría */}
          {currentView === "search" && (
            <>
              <PageHeader 
                title="¿Qué tipo de negocio buscas?"
                subtitle="Busca o selecciona una categoría para encontrar tiendas y productos"
                icon={<ShoppingBag size={32} className="inline-block align-middle text-orange-400 mr-2" />}
              />
              <SearchBar
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                placeholder="Buscar categoría..."
                showSearchButton={false}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {filteredCategories.map((category, index) => (
                  <Button
                    key={index}
                    variant="fire"
                    onClick={() => handleCategorySearch(category)}
                    className="p-4 text-sm sm:text-base"
                  >
                    {category}
                  </Button>
                ))}
                {filteredCategories.length === 0 && (
                  <Text className="col-span-full text-white/70">No se encontraron categorías para "{searchCategory}".</Text>
                )}
              </div>
            </>
          )}

          {/* Vista de tiendas de la categoría */}
          {currentView === "stores" && (
            <>
              <div className="flex justify-start mb-6">
                <Button variant="minimal" onClick={handleBackToSearch} className="text-white hover:text-orange-900">
                  <ArrowLeft size={30} />
                </Button>
              </div>
              <PageHeader 
                title={`Tiendas de ${searchCategory}`}
                subtitle="Busca o selecciona una tienda para ver sus productos"
                icon={<ShoppingBag size={32} className="inline-block align-middle text-orange-400 mr-2" />}
              />
              <SearchBar
                value={searchStores}
                onChange={(e) => setSearchStores(e.target.value)}
                placeholder="Buscar tienda por nombre..."
                showSearchButton={false}
              />
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                {filteredStores.map(store => (
                  <StoreCard key={store.id} store={store} onSelect={handleStoreSelect} />
                ))}
                {filteredStores.length === 0 && (
                  <Text className="col-span-full text-white/70">
                    {searchStores 
                      ? `No se encontraron tiendas para "${searchStores}" en ${searchCategory}.`
                      : `No se encontraron tiendas para la categoría "${searchCategory}".`
                    }
                  </Text>
                )}
              </div>
            </>
          )}

          {/* Vista de productos de la tienda */}
          {currentView === "products" && selectedStore && (
            <>
              <div className="flex justify-start mb-6">
                <Button variant="minimal" onClick={handleBackToStores} className="text-white hover:text-orange-900">
                  <ArrowLeft size={30} />
                </Button>
              </div>
              <PageHeader 
                title={selectedStore.name}
                subtitle={`Productos de ${selectedStore.category} - ${selectedStore.description}`}
                icon={<span className="text-3xl">{selectedStore.logo}</span>}
              />
              <SearchBar
                value={searchProducts}
                onChange={(e) => setSearchProducts(e.target.value)}
                placeholder="Buscar productos..."
                showSearchButton={false}
              />
              <ProductGrid products={products} onAddToCart={handleAddToCart} />
              {products.length === 0 && (
                <Text className="text-white/70 mb-8">
                  {searchProducts 
                    ? `No se encontraron productos para "${searchProducts}".`
                    : "Esta tienda no tiene productos disponibles."
                  }
                </Text>
              )}
              <div className="text-center">
                <Link to="/cart">
                  <Button className="text-lg px-8 py-4">
                    🛒 Ver Carrito ({getTotalItems()} productos)
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