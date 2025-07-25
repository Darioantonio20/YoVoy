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
import categoriesData from "../data/categories.json";

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
    // Agregar un pequeño delay para mostrar la transición
    setTimeout(() => {
      setSearchCategory(category);
      setCurrentView("stores");
      setSelectedStore(null);
      setSearchStores("");
    }, 150);
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

  // Función para obtener datos de categoría desde JSON
  const getCategoryData = (category) => {
    const categoryKey = category.toLowerCase();
    return categoriesData.categories[categoryKey] || {
      name: category,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      icon: '🛍️',
      description: 'Productos y servicios variados'
    };
  };

  return (
    <>
      {isLoading && <Spinner message="Cargando tiendas y productos..." />}
      
      {/* Carrito flotante */}
      <FloatingCart itemCount={getTotalItems()} />
      
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Círculos flotantes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-green-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
          
          {/* Líneas decorativas */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        </div>
        
        {/* Contenido principal */}
        <div className="container text-center mx-auto px-4 py-8 relative z-10">
          {/* Vista de búsqueda por categoría */}
          {currentView === "search" && (
            <>
              <PageHeader 
                title="¿Qué tipo de negocio buscas?"
                subtitle="Busca o selecciona una categoría para encontrar tiendas y productos"
                icon={<ShoppingBag size={32} className="inline-block align-middle text-orange-400 mr-2" />}
                textColor="text-white"
              />
              <div className="max-w-2xl mx-auto mb-12">
                <SearchBar
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  placeholder="Buscar categoría..."
                  showSearchButton={false}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredCategories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategorySearch(category)}
                    className="group relative overflow-hidden bg-white rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 transform-gpu h-80"
                  >
                    {/* Imagen de fondo */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: `url(${getCategoryData(category).image})` }}
                    >
                      {/* Overlay gradiente para mejor legibilidad */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                      {/* Nombre de categoría */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                        {getCategoryData(category).name}
                      </h3>
                      
                      {/* Descripción */}
                      <p className="text-white/80 text-sm mb-3">
                        {getCategoryData(category).description}
                      </p>
                      
                      {/* Contador de tiendas */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-white/70 text-xs">
                          <span>🏪</span>
                          <span>{storesInCategory.filter(store => store.category === category).length} tiendas</span>
                        </div>
                        
                        {/* Flecha indicadora */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <span className="text-orange-400 text-xl">→</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <Text className="text-white/70 text-lg mb-2">No se encontraron categorías</Text>
                    <Text className="text-white/50 text-sm">Intenta con otro término de búsqueda</Text>
                  </div>
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
                textColor="text-white"
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
                textColor="text-white"
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