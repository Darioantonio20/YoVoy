import React, { useState, useEffect } from 'react';
import { LogOut, Store } from 'lucide-react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import OrderTable from '../../molecules/admin/OrderTable';
import ProductTable from '../../molecules/admin/ProductTable';
import ProductForm from '../../molecules/admin/ProductForm';
import StoreForm from '../../molecules/admin/StoreForm';
import BackgroundDecorator from '../../atoms/BackgroundDecorator';
import Alert from '../../atoms/Alert';
import ordersData from '../../../data/admin/orders.json';
import productsData from '../../../data/admin/products.json';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [storeData, setStoreData] = useState({
    name: 'test admin',
    email: 'admin@test.com',
    phone: '+529614795475',
    location: { alias: 'Mi Tienda - Centro Comercial Plaza', googleMapsUrl: 'https://maps.app.goo.gl/9qhiAJQxLjaqDYxZA' },
    store: {
      name: 'Nombre de la Tienda',
      responsibleName: 'Nombre del Responsable',
      phone: '+529614795475',
      categories: ['moda', 'hogar'],
      description: 'Descripción de la tienda',
      images: [],
      location: { alias: 'Mi Tienda - Centro Comercial Plaza', googleMapsUrl: 'https://maps.app.goo.gl/9qhiAJQxLjaqDYxZA' },
      schedule: [
        { day: 'Lunes', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Martes', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Miércoles', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Jueves', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Viernes', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Sábado', openTime: '09:00', closeTime: '14:00', isOpen: true },
        { day: 'Domingo', openTime: '00:00', closeTime: '00:00', isOpen: false }
      ]
    }
  });

  // Cargar datos iniciales desde JSON
  useEffect(() => {
    setOrders(ordersData);
    setProducts(productsData);
  }, []);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = product => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = productData => {
    if (editingProduct) {
      // Actualizar producto existente
      setProducts(prev =>
        prev.map(p => (p.id === editingProduct.id ? productData : p))
      );
    } else {
      // Crear nuevo producto
      setProducts(prev => [...prev, productData]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSaveStore = (updatedStoreData) => {
    setStoreData(updatedStoreData);
    setShowStoreForm(false);
    Alert.success('Información Actualizada', 'Los datos de la tienda se han actualizado correctamente');
  };

  const handleCancelStoreForm = () => {
    setShowStoreForm(false);
  };

  const handleDeleteProduct = productId => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar este producto?')
    ) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleToggleProductStatus = productId => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
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
    const activeProducts = products.filter(p => p.isActive).length;
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
                <span className='text-2xl'>📦</span>
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
                <span className='text-2xl'>✅</span>
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
                <span className='text-2xl'>🛒</span>
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
                <span className='text-2xl'>⏳</span>
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
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onToggleStatus={handleToggleProductStatus}
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
                            {storeData.store.name}
                          </Text>
                        </div>
                        <div>
                          <Text variant='bodyLight' size='sm' className='text-white/70'>
                            Responsable
                          </Text>
                          <Text variant='body' size='base' className='text-white'>
                            {storeData.store.responsibleName}
                          </Text>
                        </div>
                        <div>
                          <Text variant='bodyLight' size='sm' className='text-white/70'>
                            Teléfono
                          </Text>
                          <Text variant='body' size='base' className='text-white'>
                            {storeData.store.phone}
                          </Text>
                        </div>
                        <div>
                          <Text variant='bodyLight' size='sm' className='text-white/70'>
                            Ubicación
                          </Text>
                          <Text variant='body' size='base' className='text-white'>
                            {storeData.store.location.alias}
                          </Text>
                        </div>
                        <div>
                          <Text variant='bodyLight' size='sm' className='text-white/70'>
                            Descripción
                          </Text>
                          <Text variant='body' size='base' className='text-white'>
                            {storeData.store.description}
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
                        {storeData.store.schedule.map((day) => (
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
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Categorías */}
                  <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6'>
                    <Text variant='h3' size='lg' className='text-white/90 mb-4'>
                      Categorías de Productos
                    </Text>
                    <div className='flex flex-wrap gap-2'>
                      {storeData.store.categories.map((category) => {
                        const categoryInfo = {
                          tecnologia: { label: 'Tecnología', icon: '💻' },
                          moda: { label: 'Moda', icon: '👕' },
                          juguetes: { label: 'Juguetes', icon: '🧸' },
                          comida: { label: 'Comida', icon: '🍔' },
                          hogar: { label: 'Hogar', icon: '🏠' },
                          jardin: { label: 'Jardín', icon: '🌱' },
                          mascotas: { label: 'Mascotas', icon: '🐕' },
                          deportes: { label: 'Deportes', icon: '⚽' },
                          belleza: { label: 'Belleza', icon: '💄' },
                          libros: { label: 'Libros', icon: '📚' },
                          musica: { label: 'Música', icon: '🎵' },
                          arte: { label: 'Arte', icon: '🎨' },
                          automotriz: { label: 'Automotriz', icon: '🚗' },
                          ferreteria: { label: 'Ferretería', icon: '🔧' },
                        }[category];

                        return (
                          <div
                            key={category}
                            className='flex items-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg'
                          >
                            <span className='text-lg'>{categoryInfo?.icon}</span>
                            <Text variant='body' size='sm' className='text-orange-300'>
                              {categoryInfo?.label}
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
