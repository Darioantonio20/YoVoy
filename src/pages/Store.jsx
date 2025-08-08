import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/atoms/Button';
import PageHeader from '../components/molecules/PageHeader';
import { ShoppingBag, ArrowLeft, AlertTriangle } from 'lucide-react';
import ProductGrid from '../components/organisms/ProductGrid';
import StoreCard from '../components/molecules/StoreCard';
import Text from '../components/atoms/Text';
import Spinner from '../components/atoms/Spinner';
import SearchBar from '../components/atoms/SearchBar';
import FloatingCart from '../components/atoms/FloatingCart';
import UserProfileButton from '../components/atoms/UserProfileButton';
import BackgroundDecorator from '../components/atoms/BackgroundDecorator';
import useSpinner from '../hooks/useSpinner';
import { useCartContext } from '../context/CartContext';
import { useStores } from '../hooks/useStores';
import categoriesData from '../data/categories.json';

export default function Store() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStores, setSearchStores] = useState('');
  const [searchProducts, setSearchProducts] = useState('');
  const [currentView, setCurrentView] = useState('search'); // "search", "stores", "products"
  const { isLoading: spinnerLoading } = useSpinner(1500);
  const { addToCart, getTotalItems, previousItemCount, setStore } = useCartContext();
  
  // Hook para manejar tiendas desde la API
  const { 
    stores, 
    products, 
    isLoading: storesLoading, 
    error: storesError,
    pagination,
    hasMoreProducts,
    fetchStores,
    fetchProducts,
    setCurrentStoreData,
    changePage,
    clearProducts
  } = useStores();

  // Cargar tiendas al montar el componente
  useEffect(() => {
    fetchStores({ limit: 50 }); // Cargar hasta 50 tiendas
  }, [fetchStores]);

  // Obtener categorías únicas de las tiendas cargadas
  const categories = [
    ...new Set(stores.flatMap(store => store.categories || []))
  ];

  // Filtrar categorías por búsqueda
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Filtrar tiendas por categoría buscada
  const storesInCategory = stores.filter(store =>
    store.categories?.some(cat => 
      cat.toLowerCase().includes(searchCategory.toLowerCase())
    )
  );

  // Filtrar tiendas por búsqueda adicional
  const filteredStores = storesInCategory.filter(
    store =>
      store.name.toLowerCase().includes(searchStores.toLowerCase()) ||
      (store.description && store.description.toLowerCase().includes(searchStores.toLowerCase()))
  );

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchProducts.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchProducts.toLowerCase()))
  );

  const handleCategorySearch = category => {
    // Agregar un pequeño delay para mostrar la transición
    setTimeout(() => {
      setSearchCategory(category);
      setCurrentView('stores');
      setSelectedStore(null);
      setSearchStores('');
    }, 150);
  };

  const handleStoreSelect = async (store) => {
    setSelectedStore(store);
    setCurrentView('products');
    setSearchProducts('');
    
    // Establecer la tienda actual en el contexto del carrito
    setStore(store._id);
    
    // Establecer la tienda actual en el hook
    setCurrentStoreData(store);
    
    // Cargar productos de la tienda seleccionada (primera página)
    await fetchProducts(store._id, { page: 1, limit: 10 });
  };

  const handleBackToStores = () => {
    setSelectedStore(null);
    setCurrentView('stores');
    setSearchProducts('');
    clearProducts(); // Limpiar productos al volver
  };

  const handleBackToSearch = () => {
    setSearchCategory('');
    setSelectedStore(null);
    setCurrentView('search');
    setSearchStores('');
    clearProducts(); // Limpiar productos al volver
  };

  const handleAddToCart = product => {
    addToCart(product);
  };

  // Función para manejar cambio de página
  const handlePageChange = async (newPage) => {
    if (selectedStore) {
      await changePage(newPage, selectedStore._id);
    }
  };

  // Función para obtener datos de categoría desde JSON
  const getCategoryData = category => {
    const categoryKey = category.toLowerCase();
    return (
      categoriesData.categories[categoryKey] || {
        name: category,
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        icon: 'shopping-bag',
        description: 'Productos y servicios variados',
      }
    );
  };

  // Mostrar spinner si está cargando
  if (spinnerLoading || storesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Spinner message={spinnerLoading ? 'Cargando animaciones 3D...' : 'Cargando tiendas...'} />
      </div>
    );
  }

  // Mostrar error si hay problema cargando tiendas
  if (storesError && currentView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-red-400" />
          </div>
          <Text className="text-white text-lg mb-2">Error al cargar las tiendas</Text>
          <Text className="text-white/70 text-sm mb-4">{storesError}</Text>
          <Button 
            variant="fire" 
            onClick={() => fetchStores({ limit: 50 })}
            className="px-6 py-3"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Carrito flotante */}
      <FloatingCart
        itemCount={getTotalItems()}
        previousItemCount={previousItemCount}
      />

      {/* Botón de perfil de usuario */}
      <UserProfileButton />

      <div className='relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900'>
        <BackgroundDecorator />

        {/* Contenido principal */}
        <div className='container text-center mx-auto px-4 py-8 relative z-10'>
          {/* Vista de búsqueda por categoría */}
          {currentView === 'search' && (
            <>
              <PageHeader
                title='¿Qué tipo de negocio buscas?'
                subtitle='Busca o selecciona una categoría para encontrar tiendas y productos'
                icon={
                  <ShoppingBag
                    size={32}
                    className='inline-block align-middle text-orange-400 mr-2'
                  />
                }
                textColor='text-white'
              />
              <div className='max-w-2xl mx-auto mb-12'>
                <SearchBar
                  value={searchCategory}
                  onChange={e => setSearchCategory(e.target.value)}
                  placeholder='Buscar categoría...'
                  showSearchButton={false}
                />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
                {filteredCategories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategorySearch(category)}
                    className='group relative overflow-hidden bg-white rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 transform-gpu h-80'
                  >
                    {/* Imagen de fondo */}
                    <div
                      className='absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700'
                      style={{
                        backgroundImage: `url(${getCategoryData(category).image})`,
                      }}
                    >
                      {/* Overlay gradiente para mejor legibilidad */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>
                    </div>

                    {/* Contenido */}
                    <div className='relative z-10 h-full flex flex-col justify-end p-6'>
                      {/* Nombre de categoría */}
                      <h3 className='text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300'>
                        {getCategoryData(category).name}
                      </h3>

                      {/* Descripción */}
                      <p className='text-white/80 text-sm mb-3'>
                        {getCategoryData(category).description}
                      </p>

                      {/* Contador de tiendas */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2 text-white/70 text-xs'>
                          <span>🏪</span>
                          <span>
                            {
                              storesInCategory.filter(
                                store => store.categories?.includes(category)
                              ).length
                            }{' '}
                            tiendas
                          </span>
                        </div>

                        {/* Flecha indicadora */}
                        <div className='opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                          <span className='text-orange-400 text-xl'>→</span>
                        </div>
                      </div>
                    </div>

                    {/* Efecto de brillo */}
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                  </div>
                ))}
                {filteredCategories.length === 0 && (
                  <div className='col-span-full text-center py-12'>
                    <div className='w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center'>
                      <span className='text-4xl'>🔍</span>
                    </div>
                    <Text className='text-white/70 text-lg mb-2'>
                      No se encontraron categorías
                    </Text>
                    <Text className='text-white/50 text-sm'>
                      Intenta con otro término de búsqueda
                    </Text>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Vista de tiendas de la categoría */}
          {currentView === 'stores' && (
            <>
              <div className='flex justify-start mb-6'>
                <Button
                  variant='minimal'
                  onClick={handleBackToSearch}
                  className='text-white hover:text-orange-900'
                >
                  <ArrowLeft size={30} />
                </Button>
              </div>
              <PageHeader
                title={`Tiendas de ${searchCategory}`}
                subtitle='Busca o selecciona una tienda para ver sus productos'
                icon={
                  <ShoppingBag
                    size={32}
                    className='inline-block align-middle text-orange-400 mr-2'
                  />
                }
                textColor='text-white'
              />
              <SearchBar
                value={searchStores}
                onChange={e => setSearchStores(e.target.value)}
                placeholder='Buscar tienda por nombre...'
                showSearchButton={false}
              />
              <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12'>
                {filteredStores.map(store => (
                  <StoreCard
                    key={store._id}
                    store={store}
                    onSelect={handleStoreSelect}
                  />
                ))}
                {filteredStores.length === 0 && (
                  <Text className='col-span-full text-white/70'>
                    {searchStores
                      ? `No se encontraron tiendas para "${searchStores}" en ${searchCategory}.`
                      : `No se encontraron tiendas para la categoría "${searchCategory}".`}
                  </Text>
                )}
              </div>
            </>
          )}

          {/* Vista de productos de la tienda */}
          {currentView === 'products' && selectedStore && (
            <>
              <div className='flex justify-start mb-6'>
                <Button
                  variant='minimal'
                  onClick={handleBackToStores}
                  className='text-white hover:text-orange-900'
                >
                  <ArrowLeft size={30} />
                </Button>
              </div>
              <PageHeader
                title={selectedStore.name}
                subtitle={`${selectedStore.description || 'Productos disponibles'} - ${selectedStore.categories?.join(', ') || 'Sin categoría'}`}
                icon={<span className='text-3xl'>🏪</span>}
                textColor='text-white'
              />
              <SearchBar
                value={searchProducts}
                onChange={e => setSearchProducts(e.target.value)}
                placeholder='Buscar productos...'
                showSearchButton={false}
              />
              <ProductGrid 
                products={filteredProducts} 
                onAddToCart={handleAddToCart}
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={storesLoading}
              />
              {filteredProducts.length === 0 && !storesLoading && (
                <Text className='text-white/70 mb-8'>
                  {searchProducts
                    ? `No se encontraron productos para "${searchProducts}".`
                    : 'Esta tienda no tiene productos disponibles.'}
                </Text>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
