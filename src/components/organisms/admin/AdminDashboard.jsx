import React, { useState, useEffect } from 'react';
import { LogOut, Store, Monitor, Shirt, Baby, Utensils, Home, Sprout, Dog, Trophy, Palette, BookOpen, Music, Palette as Art, Car, Wrench, Package, CheckCircle, ShoppingCart, Clock } from 'lucide-react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import OrderTable from '../../molecules/admin/OrderTable';
import ProductTable from '../../molecules/admin/ProductTable';
import ProductForm from '../../molecules/admin/ProductForm';
import StoreForm from '../../molecules/admin/StoreForm';
import BackgroundDecorator from '../../atoms/BackgroundDecorator';
import Alert from '../../atoms/Alert';
import { useAdmin } from '../../../hooks/useAdmin';
import { useAuth } from '../../../hooks/useAuth';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [storeData, setStoreData] = useState(null);
  const [productTableKey, setProductTableKey] = useState(0);
  
  // Hooks para admin
  const { user } = useAuth();
  const { 
    isLoading: adminLoading,
    getMyStore,
    updateStore,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAdminOrders,
    updateOrderStatus,
    getAdminStats
  } = useAdmin();

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (user?._id) {
        // Cargar datos de la tienda
        const store = await getMyStore(user._id);
        if (store) {
          setStoreData(store);
          
          // Cargar productos solo si tenemos la tienda
          const productsData = await getMyProducts(store._id);
          if (productsData) {
            setProducts(productsData.data || []);
          }
        }
        
        // Cargar pedidos
        const ordersData = await getAdminOrders();
        if (ordersData) {
          setOrders(ordersData.orders || []);
        }
      }
    };
    
    loadInitialData();
  }, [user?._id]); // Solo dependencia del user



  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = product => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData) => {
    let result;
    
    if (editingProduct) {
      // Actualizar producto existente
      result = await updateProduct(storeData._id, editingProduct._id, productData);
      
      if (result) {
        setShowProductForm(false);
        setEditingProduct(null);
        // Actualizar el producto en el estado local en lugar de recargar todo
        setProducts(prevProducts => 
          prevProducts.map(p => p._id === editingProduct._id ? { ...p, ...productData } : p)
        );
      }
    } else {
      // Crear nuevo producto
      result = await createProduct(storeData._id, productData);
      
      if (result) {
        setShowProductForm(false);
        setEditingProduct(null);
        // Agregar el nuevo producto al estado local
        setProducts(prevProducts => [...prevProducts, result]);
      }
    }
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSaveStore = async (updatedStoreData) => {
    if (storeData?._id) {
      const result = await updateStore(storeData._id, updatedStoreData);
      if (result) {
        setShowStoreForm(false);
        setStoreData(result);
      }
    }
  };

  const handleCancelStoreForm = () => {
    setShowStoreForm(false);
  };

  const handleDeleteProduct = productId => {
    // Esta función ahora se maneja directamente en ProductTable
  };



  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result) {
      // Actualizar solo el pedido específico en el estado local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  const handleLogout = async () => {
    const result = await Alert.confirm(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión del panel administrativo?'
    );

    if (result.isConfirmed) {
      window.location.href = '/';

      Alert.success(
        'Sesión Cerrada',
        'Has cerrado sesión exitosamente del panel administrativo'
      );
    }
  };

  const getStats = () => {
    const totalProducts = products.length;
    // Los productos activos son todos los que están en la lista (no hay campo isActive en la API)
    const activeProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pendiente').length;

    return { totalProducts, activeProducts, totalOrders, pendingOrders };
  };

  const stats = getStats();

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden'>
      <BackgroundDecorator />
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8 flex flex-col sm:flex-row justify-between items-start gap-4'>
          <div className='flex-1'>
            <div className='text-left'>
              <div className='flex items-center mb-4 gap-2'>
                <Text
                  variant='h1'
                  size='2xl'
                  className='sm:text-3xl text-white'
                >
                  <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                    Panel Administrativo
                  </span>
                </Text>
              </div>
              <Text
                variant='bodyLight'
                size='sm'
                className='sm:text-lg text-white/70'
              >
                Gestiona tu tienda, productos y pedidos
              </Text>
            </div>
          </div>
          <Button
            variant='danger'
            onClick={handleLogout}
            className='self-start sm:self-auto p-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all duration-300'
            title='Cerrar Sesión'
          >
            <LogOut size={20} className='sm:w-6 sm:h-6' />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30'>
                <Package size={24} className='text-blue-400' />
              </div>
              <div className='ml-4'>
                <Text variant='bodyLight' size='sm' className='text-white/70'>
                  Total Productos
                </Text>
                <Text variant='h2' size='2xl' className='text-white'>
                  {stats.totalProducts}
                </Text>
              </div>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30'>
                <CheckCircle size={24} className='text-green-400' />
              </div>
              <div className='ml-4'>
                <Text variant='bodyLight' size='sm' className='text-white/70'>
                  Productos Activos
                </Text>
                <Text variant='h2' size='2xl' className='text-white'>
                  {stats.activeProducts}
                </Text>
              </div>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30'>
                <ShoppingCart size={24} className='text-purple-400' />
              </div>
              <div className='ml-4'>
                <Text variant='bodyLight' size='sm' className='text-white/70'>
                  Total Pedidos
                </Text>
                <Text variant='h2' size='2xl' className='text-white'>
                  {stats.totalOrders}
                </Text>
              </div>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30'>
                <Clock size={24} className='text-yellow-400' />
              </div>
              <div className='ml-4'>
                <Text variant='bodyLight' size='sm' className='text-white/70'>
                  Pedidos Pendientes
                </Text>
                <Text variant='h2' size='2xl' className='text-white'>
                  {stats.pendingOrders}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 mb-8'>
          <div className='border-b border-white/20'>
            <nav className='flex space-x-8 px-6'>
              <button
                onClick={() => setActiveSection('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeSection === 'orders'
                    ? 'border-orange-400 text-orange-300'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                Pedidos
              </button>
              <button
                onClick={() => setActiveSection('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeSection === 'products'
                    ? 'border-orange-400 text-orange-300'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => setActiveSection('store')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeSection === 'store'
                    ? 'border-orange-400 text-orange-300'
                    : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                Tienda
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className='space-y-8'>
          {activeSection === 'orders' && (
            <OrderTable
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              isLoading={adminLoading}
            />
          )}

          {activeSection === 'products' && (
            <div className='space-y-6'>
              {/* Header con botón de crear */}
              <div className='flex justify-between items-center'>
                <div>
                  <Text variant='h2' size='xl' className='text-white'>
                    <span className='bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>
                      Gestión de Productos
                    </span>
                  </Text>
                  <Text
                    variant='bodyLight'
                    size='sm'
                    className='text-white/70 mt-1'
                  >
                    Crea, edita y gestiona los productos de tu tienda
                  </Text>
                </div>
                <Button
                  variant='success'
                  onClick={handleCreateProduct}
                  className='flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                >
                  <span>+</span>
                  <span>Crear Producto</span>
                </Button>
              </div>

              {/* Formulario de producto */}
              {showProductForm && (
                <ProductForm
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={handleCancelProductForm}
                  isEditing={!!editingProduct}
                />
              )}

              {/* Tabla de productos */}
              <ProductTable
                key={productTableKey}
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onDeleteProduct={(productId) => deleteProduct(storeData._id, productId)}
                isLoading={adminLoading}
              />
            </div>
          )}

          {activeSection === 'store' && (
            <div className='space-y-6'>
              {/* Header */}
              <div className='flex justify-between items-center'>
                <div>
                  <Text variant='h2' size='xl' className='text-white'>
                    <span className='bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
                      Información de la Tienda
                    </span>
                  </Text>
                  <Text
                    variant='bodyLight'
                    size='sm'
                    className='text-white/70 mt-1'
                  >
                    {showStoreForm 
                      ? 'Edita los datos de tu tienda y horarios de atención'
                      : 'Gestiona los datos de tu tienda y horarios de atención'
                    }
                  </Text>
                </div>
                <Button
                  variant={showStoreForm ? 'danger' : 'primary'}
                  onClick={() => setShowStoreForm(!showStoreForm)}
                  className={`flex items-center space-x-2 ${
                    showStoreForm 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                  }`}
                >
                  <Store size={18} />
                  <span>{showStoreForm ? 'Cancelar Edición' : 'Editar Tienda'}</span>
                </Button>
              </div>

              {/* Contenido principal */}
              {showStoreForm ? (
                /* Formulario de edición */
                <StoreForm
                  storeData={storeData}
                  onSave={handleSaveStore}
                  onCancel={handleCancelStoreForm}
                />
              ) : (
                /* Vista previa de la información */
                <>
                  {adminLoading ? (
                    <div className='flex items-center justify-center py-12'>
                      <div className='w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      <Text variant='body' size='base' className='text-white/70 ml-3'>
                        Cargando datos de la tienda...
                      </Text>
                    </div>
                  ) : storeData ? (
                    <>
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {/* Información básica */}
                        <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6'>
                          <Text variant='h3' size='lg' className='text-white/90 mb-4'>
                            Datos de la Tienda
                          </Text>
                          <div className='space-y-3'>
                            <div>
                              <Text variant='bodyLight' size='sm' className='text-white/70'>
                                Nombre de la Tienda
                              </Text>
                              <Text variant='body' size='base' className='text-white'>
                                {storeData.name || 'Sin nombre'}
                              </Text>
                            </div>
                            <div>
                              <Text variant='bodyLight' size='sm' className='text-white/70'>
                                Responsable
                              </Text>
                              <Text variant='body' size='base' className='text-white'>
                                {storeData.responsibleName || 'Sin responsable'}
                              </Text>
                            </div>
                            <div>
                              <Text variant='bodyLight' size='sm' className='text-white/70'>
                                Teléfono
                              </Text>
                              <Text variant='body' size='base' className='text-white'>
                                {storeData.phone || 'Sin teléfono'}
                              </Text>
                            </div>
                            <div>
                              <Text variant='bodyLight' size='sm' className='text-white/70'>
                                Ubicación
                              </Text>
                              <Text variant='body' size='base' className='text-white'>
                                {storeData.location?.alias || 'No especificada'}
                              </Text>
                            </div>
                            <div>
                              <Text variant='bodyLight' size='sm' className='text-white/70'>
                                Descripción
                              </Text>
                              <Text variant='body' size='base' className='text-white'>
                                {storeData.description || 'Sin descripción'}
                              </Text>
                            </div>
                          </div>
                        </div>

                        {/* Horarios */}
                        <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6'>
                          <Text variant='h3' size='lg' className='text-white/90 mb-4'>
                            Horarios de Atención
                          </Text>
                          <div className='space-y-2'>
                            {storeData.schedule?.length > 0 ? (
                              storeData.schedule.map((day) => (
                                <div key={day.day} className='flex justify-between items-center py-2 border-b border-white/10 last:border-b-0'>
                                  <Text variant='body' size='sm' className='text-white/90'>
                                    {day.day}
                                  </Text>
                                  <div className='flex items-center gap-2'>
                                    {day.isOpen ? (
                                      <>
                                        <Text variant='body' size='sm' className='text-green-400'>
                                          {day.openTime}
                                        </Text>
                                        <Text variant='body' size='sm' className='text-white/50'>
                                          -
                                        </Text>
                                        <Text variant='body' size='sm' className='text-green-400'>
                                          {day.closeTime}
                                        </Text>
                                      </>
                                    ) : (
                                      <Text variant='body' size='sm' className='text-red-400'>
                                        Cerrado
                                      </Text>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <Text variant='body' size='sm' className='text-white/50 italic'>
                                No hay horarios configurados
                              </Text>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Categorías */}
                      <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6'>
                        <Text variant='h3' size='lg' className='text-white/90 mb-4'>
                          Categorías de Productos
                        </Text>
                        <div className='flex flex-wrap gap-2'>
                          {storeData.categories?.length > 0 ? (
                            storeData.categories.map((category) => {
                              const categoryInfo = {
                                tecnologia: { label: 'tecnologia', icon: Monitor, color: 'text-blue-400' },
                                moda: { label: 'moda', icon: Shirt, color: 'text-pink-400' },
                                juguetes: { label: 'juguetes', icon: Baby, color: 'text-yellow-400' },
                                comida: { label: 'comida', icon: Utensils, color: 'text-orange-400' },
                                hogar: { label: 'hogar', icon: Home, color: 'text-green-400' },
                                jardin: { label: 'jardin', icon: Sprout, color: 'text-emerald-400' },
                                mascotas: { label: 'mascotas', icon: Dog, color: 'text-amber-400' },
                                deportes: { label: 'deportes', icon: Trophy, color: 'text-purple-400' },
                                belleza: { label: 'belleza', icon: Palette, color: 'text-rose-400' },
                                libros: { label: 'libros', icon: BookOpen, color: 'text-indigo-400' },
                                musica: { label: 'musica', icon: Music, color: 'text-violet-400' },
                                arte: { label: 'arte', icon: Art, color: 'text-cyan-400' },
                                automotriz: { label: 'automotriz', icon: Car, color: 'text-red-400' },
                                ferreteria: { label: 'ferreteria', icon: Wrench, color: 'text-gray-400' },
                              }[category];

                              return (
                                <div
                                  key={category}
                                  className='flex items-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg'
                                >
                                  {categoryInfo?.icon && (
                                    <categoryInfo.icon 
                                      size={18} 
                                      className={`${categoryInfo.color} flex-shrink-0`} 
                                    />
                                  )}
                                  <Text variant='body' size='sm' className='text-orange-300'>
                                    {categoryInfo?.label}
                                  </Text>
                                </div>
                              );
                            })
                          ) : (
                            <Text variant='body' size='sm' className='text-white/50 italic'>
                              No hay categorías configuradas
                            </Text>
                          )}
                        </div>
                      </div>

                      {/* Redes Sociales */}
                      {storeData.socialMedia && (storeData.socialMedia.tiktok || storeData.socialMedia.facebook || storeData.socialMedia.instagram) && (
                        <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6'>
                          <Text variant='h3' size='lg' className='text-white/90 mb-4'>
                            Redes Sociales
                          </Text>
                          <div className='flex flex-wrap gap-3'>
                            {storeData.socialMedia.tiktok && (
                              <a
                                href={storeData.socialMedia.tiktok}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 px-3 py-2 bg-black/50 border border-white/20 rounded-lg hover:bg-black/70 transition-colors'
                              >
                                <svg className='w-4 h-4 text-white' viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.35 3.12-5.35 3.47-2.26.39-4.52-.13-6.44-1.28-1.92-1.15-3.35-3.12-3.47-5.35-.12-2.22.13-4.52 1.28-6.44 1.15-1.92 3.12-3.35 5.35-3.47 1.4-.08 2.79.54 3.94 1.35.01-2.92-.01-5.84.02-8.75.08-1.4.54-2.79 1.35-3.94 1.31-1.92 3.35-3.12 5.35-3.47 2.26-.39 4.52.13 6.44 1.28 1.92 1.15 3.35 3.12 3.47 5.35.12 2.22-.13 4.52-1.28 6.44-1.15 1.92-3.12 3.35-5.35 3.47-1.4.08-2.79-.54-3.94-1.35z"/>
                                </svg>
                                <Text variant='body' size='sm' className='text-white'>
                                  TikTok
                                </Text>
                              </a>
                            )}
                            
                            {storeData.socialMedia.facebook && (
                              <a
                                href={storeData.socialMedia.facebook}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 px-3 py-2 bg-blue-600/50 border border-blue-500/30 rounded-lg hover:bg-blue-600/70 transition-colors'
                              >
                                <svg className='w-4 h-4 text-white' viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                <Text variant='body' size='sm' className='text-white'>
                                  Facebook
                                </Text>
                              </a>
                            )}
                            
                            {storeData.socialMedia.instagram && (
                              <a
                                href={storeData.socialMedia.instagram}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 border border-purple-500/30 rounded-lg hover:from-purple-600/70 hover:to-pink-600/70 transition-colors'
                              >
                                <svg className='w-4 h-4 text-white' viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                <Text variant='body' size='sm' className='text-white'>
                                  Instagram
                                </Text>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className='flex items-center justify-center py-12'>
                      <Text variant='body' size='base' className='text-white/70'>
                        No se pudieron cargar los datos de la tienda
                      </Text>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
