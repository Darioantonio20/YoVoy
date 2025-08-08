import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X, Settings, LogOut, Edit3, ChevronDown, MapPin, Trash2, Star, Package, Calendar, Clock, Search, Store, Package2, DollarSign, Pizza } from 'lucide-react';
import Text from './Text';
import Button from './Button';
import Alert from './Alert';
import SearchBar from './SearchBar';
import { useAuth } from '../../hooks/useAuth';
import { useMyOrders } from '../../hooks/useMyOrders';
import { apiRequest, API_CONFIG } from '../../config/api';
import { calculateDeliveryFee, getCurrentTimeSlot, formatTime } from '../../utils/deliveryPricing';

const UserProfileButton = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    locations: [],
    currentLocationIndex: 0
  });
  const [newLocation, setNewLocation] = useState({ alias: '', googleMapsUrl: '' });
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingLocationText, setEditingLocationText] = useState({ alias: '', googleMapsUrl: '' });
  const [showLocationModal, setShowLocationModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [searchOrders, setSearchOrders] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    orders, 
    selectedOrder, 
    isLoading: isLoadingOrders, 
    getMyOrders, 
    getMyOrder, 
    clearSelectedOrder 
  } = useMyOrders();

  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (user) {
      // Nueva estructura del backend: siempre locations[] y currentLocationIndex
      const locations = user.locations || [];
      const currentLocationIndex = user.currentLocationIndex || 0;

      setUserData({
        name: user.name || '',
        phone: user.phone || '',
        locations: locations,
        currentLocationIndex: currentLocationIndex
      });
    }
  }, [user]);

  const handleLogout = async () => {
    setIsOpen(false);
    const result = await Alert.confirm(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión? Perderás acceso a tu cuenta hasta que vuelvas a iniciar sesión.'
    );
    
    if (result.isConfirmed) {
      logout();
    }
  };

  const handleEditProfile = async () => {
    setIsOpen(false);
    setShowEditModal(true);
    setIsLoadingProfile(true);
    
    // Obtener datos actualizados del usuario
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE, {
        method: 'GET',
      });

      if (response.success) {
        const updatedUserData = response.data.data;
        
        // Nueva estructura del backend: siempre locations[] y currentLocationIndex
        const locations = updatedUserData.locations || [];
        const currentLocationIndex = updatedUserData.currentLocationIndex || 0;

        setUserData({
          name: updatedUserData.name || '',
          phone: updatedUserData.phone || '',
          locations: locations,
          currentLocationIndex: currentLocationIndex
        });
        
        // Actualizar también el localStorage con los datos más recientes
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      } else {
        console.error('Error fetching user data:', response.data.message);
        await Alert.error(
          'Error al Cargar Datos',
          'No se pudieron cargar los datos del perfil. Intenta de nuevo.'
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      await Alert.error(
        'Error de Conexión',
        'No se pudo conectar con el servidor para cargar los datos del perfil.'
      );
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleViewOrders = async () => {
    setIsOpen(false);
    setShowOrdersModal(true);
    setSearchOrders(''); // Limpiar búsqueda al abrir
    
    // Verificar autenticación (logs removidos para producción)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    try {
      const result = await getMyOrders();
      if (!result) {
        // No se pudieron cargar los pedidos
      }
    } catch (error) {
      await Alert.error('Error', 'No se pudieron cargar los pedidos');
    }
  };

  const handleSearchOrders = () => {
    filterOrders(searchOrders);
  };

  const handleCloseOrdersModal = () => {
    setShowOrdersModal(false);
    setSearchOrders('');
    setFilteredOrders([]);
  };

  const handleViewOrderDetail = async (orderId) => {
    try {
      await getMyOrder(orderId);
      setShowOrderDetailModal(true);
    } catch (error) {
      console.error('Error loading order detail:', error);
    }
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetailModal(false);
    clearSelectedOrder();
  };

  // Función para filtrar pedidos
  const filterOrders = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.status?.toLowerCase().includes(searchLower) ||
        order.storeId?.name?.toLowerCase().includes(searchLower) ||
        order.products?.some(product => 
          product.name?.toLowerCase().includes(searchLower)
        ) ||
        new Date(order.createdAt).toLocaleDateString().includes(searchTerm)
      );
    });

    setFilteredOrders(filtered);
  };

  // Actualizar pedidos filtrados cuando cambien los pedidos o la búsqueda
  useEffect(() => {
    filterOrders(searchOrders);
  }, [orders, searchOrders]);

  const handleSettings = async () => {
    setIsOpen(false);
    await Alert.info(
      'Configuración',
      'Próximamente podrás personalizar tus preferencias, ajustar notificaciones y configurar la privacidad de tu cuenta.'
    );
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone
          // ❌ Removed location - ahora se maneja por separado con los endpoints de locations
        }),
      });

      if (response.success) {
        // Obtener los datos más recientes del servidor después de la actualización
        try {
          const getProfileResponse = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE, {
            method: 'GET',
          });

          if (getProfileResponse.success) {
            // Actualizar los datos del usuario en localStorage con la respuesta más reciente
            const updatedUserData = getProfileResponse.data.data;
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
          }
        } catch (error) {
          console.error('Error fetching updated user data:', error);
        }
        
        setShowEditModal(false);
        await Alert.success(
          'Perfil Actualizado',
          'Tu información personal ha sido actualizada exitosamente.'
        );
        
        // Recargar la página para reflejar los cambios
        window.location.reload();
      } else {
        await Alert.error(
          'Error al Actualizar',
          response.data.message || 'No se pudo actualizar el perfil.'
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      await Alert.error(
        'Error de Conexión',
        'No se pudo conectar con el servidor para actualizar el perfil.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    // Restaurar datos originales
    if (user) {
      // Nueva estructura del backend: siempre locations[] y currentLocationIndex
      const locations = user.locations || [];
      const currentLocationIndex = user.currentLocationIndex || 0;

      setUserData({
        name: user.name || '',
        phone: user.phone || '',
        locations: locations,
        currentLocationIndex: currentLocationIndex
      });
    }
  };

  const handleUpdateUserData = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones para manejar ubicaciones
  const handleAddLocation = async () => {
    if (!newLocation.alias.trim() || !newLocation.googleMapsUrl.trim()) {
      await Alert.error('Campos Requeridos', 'Por favor completa el alias y el enlace de Google Maps.');
      return;
    }

    setIsLoadingLocations(true);
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOCATIONS.ADD, {
        method: 'POST',
        body: JSON.stringify({
          alias: newLocation.alias.trim(),
          googleMapsUrl: newLocation.googleMapsUrl.trim()
        }),
      });

      if (response.success) {
        setUserData(prev => ({
          ...prev,
          locations: response.data.data
        }));
        setNewLocation({ alias: '', googleMapsUrl: '' });
        await Alert.success('Ubicación Agregada', 'La nueva ubicación ha sido agregada exitosamente.');
      } else {
        await Alert.error('Error al Agregar', response.data.message || 'No se pudo agregar la ubicación.');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      await Alert.error('Error de Conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleUpdateLocation = async (locationId) => {
    if (!editingLocationText.alias.trim() || !editingLocationText.googleMapsUrl.trim()) {
      await Alert.error('Campos Requeridos', 'Por favor completa el alias y el enlace de Google Maps.');
      return;
    }

    setIsLoadingLocations(true);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.AUTH.LOCATIONS.UPDATE.replace(':id', locationId);
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify({
          alias: editingLocationText.alias.trim(),
          googleMapsUrl: editingLocationText.googleMapsUrl.trim()
        }),
      });

      if (response.success) {
        setUserData(prev => ({
          ...prev,
          locations: response.data.data
        }));
        setEditingLocation(null);
        setEditingLocationText({ alias: '', googleMapsUrl: '' });
        await Alert.success('Ubicación Actualizada', 'La ubicación ha sido actualizada exitosamente.');
      } else {
        await Alert.error('Error al Actualizar', response.data.message || 'No se pudo actualizar la ubicación.');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      await Alert.error('Error de Conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    const result = await Alert.confirm(
      'Eliminar Ubicación',
      '¿Estás seguro de que quieres eliminar esta ubicación? Esta acción no se puede deshacer.'
    );

    if (!result.isConfirmed) return;

    setIsLoadingLocations(true);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.AUTH.LOCATIONS.DELETE.replace(':id', locationId);
      const response = await apiRequest(endpoint, {
        method: 'DELETE',
      });

      if (response.success) {
        // Recargar datos del usuario para obtener la lista actualizada
        const profileResponse = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.GET_PROFILE, {
          method: 'GET',
        });

        if (profileResponse.success) {
          const updatedUserData = profileResponse.data.data;
          
          // Nueva estructura del backend: siempre locations[] y currentLocationIndex
          const locations = updatedUserData.locations || [];
          const currentLocationIndex = updatedUserData.currentLocationIndex || 0;

          setUserData({
            name: updatedUserData.name || '',
            phone: updatedUserData.phone || '',
            locations: locations,
            currentLocationIndex: currentLocationIndex
          });
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }

        await Alert.success('Ubicación Eliminada', 'La ubicación ha sido eliminada exitosamente.');
      } else {
        await Alert.error('Error al Eliminar', response.data.message || 'No se pudo eliminar la ubicación.');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      await Alert.error('Error de Conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleSetCurrentLocation = async (locationId) => {
    setIsLoadingLocations(true);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.AUTH.LOCATIONS.SET_CURRENT.replace(':id', locationId);
      const response = await apiRequest(endpoint, {
        method: 'PUT',
      });

      if (response.success) {
        setUserData(prev => ({
          ...prev,
          currentLocationIndex: response.data.data.currentLocationIndex
        }));
        await Alert.success('Ubicación Actual', 'La ubicación actual ha sido cambiada exitosamente.');
      } else {
        await Alert.error('Error al Cambiar', response.data.message || 'No se pudo cambiar la ubicación actual.');
      }
    } catch (error) {
      console.error('Error setting current location:', error);
      await Alert.error('Error de Conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location._id);
    setEditingLocationText({
      alias: location.alias || '',
      googleMapsUrl: location.googleMapsUrl || ''
    });
  };

  const handleCancelEditLocation = () => {
    setEditingLocation(null);
    setEditingLocationText({ alias: '', googleMapsUrl: '' });
  };

  // Si no hay usuario autenticado, no mostrar el componente
  if (!user) {
    return null;
  }

  const currentLocation = userData.locations[userData.currentLocationIndex];

  return (
    <>
      {/* Botón de perfil */}
      <div className={`fixed z-50 group right-6 top-28 ${className}`}>
        <div className='relative'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 backdrop-blur-sm active:scale-95 ${isOpen ? 'ring-4 ring-orange-400 ring-opacity-75' : ''}`}
          >
            <User className='w-6 h-6 text-white drop-shadow-sm' />
          </button>

          <div className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className='w-3 h-3' />
          </div>
        </div>
      </div>

      {/* Menú desplegable */}
      {isOpen && (
        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)}>
          <div className='menu-content absolute bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 min-w-64 max-w-80 transform transition-all duration-300 ease-out right-4 top-40 sm:right-6 md:right-6 lg:right-6' onClick={e => e.stopPropagation()}>
            {/* Header del menú */}
            <div className='flex items-center justify-between mb-4 pb-3 border-b border-gray-700'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                  <User className='w-5 h-5 text-white' />
                </div>
                <div>
                  <Text variant='h3' size='base' className='text-white'>{user.name || 'Mi Perfil'}</Text>
                  <Text variant='caption' size='sm' className='text-gray-400'>{user.role === 'admin' ? 'Administrador' : 'Cliente'}</Text>
                  {currentLocation && (
                    <Text variant='caption' size='xs' className='text-orange-400'>📍 {currentLocation.alias}</Text>
                  )}
                </div>
              </div>
              <Button onClick={() => setIsOpen(false)} variant='danger' className='p-2 text-gray-400 hover:text-gray-200 border-none bg-transparent'>
                <X size={10} />
              </Button>
            </div>

            {/* Opciones del menú */}
            <div className='space-y-2'>
              <Button onClick={handleEditProfile} variant='minimal' className='w-full flex items-center gap-3 px-3 py-3 text-left text-gray-200 hover:bg-gray-800 rounded-xl border-none bg-transparent'>
                <div className='w-8 h-8 bg-orange-900/50 rounded-lg flex items-center justify-center group-hover:bg-orange-800/70 transition-colors'>
                  <Edit3 className='w-4 h-4 text-orange-400' />
                </div>
                <div>
                  <Text variant='bodyBold' size='sm' className='text-white'>Editar Perfil</Text>
                  <Text variant='caption' size='xs' className='text-gray-400'>Modificar datos personales</Text>
                </div>
              </Button>

              <Button onClick={handleViewOrders} variant='minimal' className='w-full flex items-center gap-3 px-3 py-3 text-left text-gray-200 hover:bg-gray-800 rounded-xl border-none bg-transparent'>
                <div className='w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:bg-blue-800/70 transition-colors'>
                  <Package className='w-4 h-4 text-blue-400' />
                </div>
                <div>
                  <Text variant='bodyBold' size='sm' className='text-white'>Mis Pedidos</Text>
                  <Text variant='caption' size='xs' className='text-gray-400'>Ver historial de pedidos</Text>
                </div>
              </Button>

              <Button onClick={handleSettings} variant='minimal' className='w-full flex items-center gap-3 px-3 py-3 text-left text-gray-200 hover:bg-gray-800 rounded-xl border-none bg-transparent'>
                <div className='w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors'>
                  <Settings className='w-4 h-4 text-gray-400' />
                </div>
                <div>
                  <Text variant='bodyBold' size='sm' className='text-white'>Configuración</Text>
                  <Text variant='caption' size='xs' className='text-gray-400'>Preferencias y ajustes</Text>
                </div>
              </Button>

              <div className='border-t border-gray-700 pt-2'>
                <Button onClick={handleLogout} variant='minimal' className='w-full flex items-center gap-3 px-3 py-3 text-left text-red-400 hover:bg-red-900/30 rounded-xl border-none bg-transparent'>
                  <div className='w-8 h-8 bg-red-900/50 rounded-lg flex items-center justify-center group-hover:bg-red-800/70 transition-colors'>
                    <LogOut className='w-4 h-4 text-red-400' />
                  </div>
                  <div>
                    <Text variant='bodyBold' size='sm' className='text-red-300'>Cerrar Sesión</Text>
                    <Text variant='caption' size='xs' className='text-red-400'>Salir de la aplicación</Text>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición de Perfil */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <Text variant="h3" size="base" className="text-white">Editar Perfil</Text>
              </div>
              <Button onClick={handleCancelEdit} variant="minimal" className="p-2 text-red-400 hover:bg-gray-700 border-none bg-transparent">
                <X size={20} />
              </Button>
            </div>

            {/* Formulario */}
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <Text variant="body" size="sm" className="text-gray-400">Cargando datos del perfil...</Text>
                </div>
              </div>
            ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Nombre completo */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">Nombre Completo</Text>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleUpdateUserData('name', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              {/* Número de teléfono */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">Número de Teléfono</Text>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleUpdateUserData('phone', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="+52 55 1234 5678"
                />
              </div>

              {/* Email (solo lectura) */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">Email</Text>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed text-sm sm:text-base"
                  placeholder="No se puede modificar"
                />
                <Text variant="caption" size="xs" className="text-gray-500 mt-1">El email no se puede modificar por seguridad</Text>
              </div>

              {/* Ubicaciones */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">Mis Ubicaciones</Text>
                
                {/* Lista de ubicaciones existentes */}
                <div className="space-y-2 mb-4">
                  {userData.locations.map((location, index) => (
                    <div 
                      key={location._id} 
                      className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 sm:p-3 rounded-lg border transition-colors ${
                        index === userData.currentLocationIndex
                          ? 'bg-orange-500/20 border-orange-500/30' 
                          : 'bg-gray-800 border-gray-600'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 flex-shrink-0 self-center ${index === userData.currentLocationIndex ? 'text-orange-300' : 'text-orange-400'}`} />
                      
                      {/* Contenido de la ubicación */}
                      {editingLocation === location._id ? (
                        // Modo edición
                        <div className="flex-1 w-full">
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingLocationText.alias}
                              onChange={(e) => setEditingLocationText(prev => ({ ...prev, alias: e.target.value }))}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                              placeholder="Nombre de la ubicación"
                            />
                            <input
                              type="text"
                              value={editingLocationText.googleMapsUrl}
                              onChange={(e) => setEditingLocationText(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleUpdateLocation(location._id)}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                              placeholder="Pega el vínculo de Google Maps"
                            />
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                onClick={() => handleUpdateLocation(location._id)}
                                variant="minimal"
                                className="flex-1 p-2 sm:p-1 text-green-400 hover:text-green-300 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-400/50"
                                disabled={isLoadingLocations}
                              >
                                <Text variant="caption" size="sm">✓ Guardar</Text>
                              </Button>
                              <Button
                                onClick={handleCancelEditLocation}
                                variant="minimal"
                                className="flex-1 p-2 sm:p-1 text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-400/50"
                              >
                                <Text variant="caption" size="sm">✗ Cancelar</Text>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Modo visualización
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <div className="flex items-center gap-2">
                              <Text variant="body" size="sm" className={`font-medium ${index === userData.currentLocationIndex ? 'text-orange-300' : 'text-white'}`}>
                                {location.alias}
                              </Text>
                              {index === userData.currentLocationIndex && (
                                <Star className="w-3 h-3 text-orange-300" fill="currentColor" />
                              )}
                            </div>
                            <Text variant="body" size="xs" className="text-white/70 truncate">
                              {location.googleMapsUrl}
                            </Text>
                          </div>
                        </div>
                      )}
                      
                                                                     {/* Botones de acción */}
                      <div className="flex items-center gap-1 self-center">
                        {index !== userData.currentLocationIndex && (
                          <Button
                            onClick={() => handleSetCurrentLocation(location._id)}
                            variant="minimal"
                            className="p-1 text-orange-400 hover:text-orange-300 bg-orange-500/20 hover:bg-orange-500/30 border-none"
                            disabled={isLoadingLocations}
                          >
                            <Star size={14} />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleEditLocation(location)}
                          variant="minimal"
                          className="p-1 text-blue-200/70 hover:text-blue-500 bg-blue-500/20 hover:bg-blue-300/30 border-none"
                          disabled={isLoadingLocations}
                        >
                          <Edit3 size={14} />
                        </Button>
                        {userData.locations.length > 1 && (
                          <Button
                            onClick={() => handleDeleteLocation(location._id)}
                            variant="minimal"
                            className="p-1 text-red-400 hover:text-red-500 bg-red-500/20 hover:bg-red-500/30 border-none"
                            disabled={isLoadingLocations}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Agregar nueva ubicación */}
                <div className="space-y-3">
                  {/* Botón para abrir Google Maps */}
                  <button
                    type="button"
                    onClick={() => window.open('https://www.google.com/maps', '_blank')}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-300 hover:text-orange-200 transition-colors text-xs w-full justify-center"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Abrir Google Maps
                  </button>
                  
                  {/* Instrucciones */}
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300/90">
                    <div className="space-y-1">
                      <p className="font-medium text-blue-300">📍 Instrucciones:</p>
                      <p>1. Busca tu ubicación en Google Maps</p>
                      <p>2. Busca el ícono de compartir</p>
                      <p>3. Dale clic en copiar vínculo</p>
                      <p>4. Pégala en el campo de abajo</p>
                    </div>
                  </div>
                  
                  {/* Inputs para nueva ubicación */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newLocation.alias}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, alias: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Nombre de la ubicación (ej: Casa, Trabajo, etc.)"
                    />
                    <input
                      type="text"
                      value={newLocation.googleMapsUrl}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Pega aquí el vínculo de Google Maps"
                    />
                    <Button
                      onClick={handleAddLocation}
                      variant="fire"
                      className="w-full px-4 py-3"
                      disabled={!newLocation.alias.trim() || !newLocation.googleMapsUrl.trim() || isLoadingLocations}
                    >
                      {isLoadingLocations ? 'Agregando...' : 'Agregar Ubicación'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={handleSaveProfile}
                variant="fire"
                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pedidos */}
      {showOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <Text variant="h3" size="base" className="text-white">Mis Pedidos</Text>
              </div>
              <Button onClick={handleCloseOrdersModal} variant="minimal" className="p-2 text-red-400 hover:bg-gray-700 border-none bg-transparent">
                <X size={20} />
              </Button>
            </div>

            {/* SearchBar para buscar pedidos */}
            <div className="mb-6">
              <SearchBar
                value={searchOrders}
                onChange={(e) => setSearchOrders(e.target.value)}
                placeholder="Buscar por número de orden, estado, tienda, productos..."
                onSearch={handleSearchOrders}
                className="mb-4"
              />
              
              {/* Contador de resultados */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>
                  {filteredOrders.length} de {orders.length} pedidos
                </span>
                {searchOrders && (
                  <button
                    onClick={() => setSearchOrders('')}
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>

            {/* Contenido */}
            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <Text variant="body" size="sm" className="text-gray-400">Cargando pedidos...</Text>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <Text variant="h4" size="base" className="text-gray-300 mb-2">No tienes pedidos</Text>
                <Text variant="body" size="sm" className="text-gray-500">Realiza tu primer pedido para verlo aquí</Text>
              </div>
            ) : filteredOrders.length === 0 && searchOrders ? (
              <div className="text-center py-8">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <Text variant="h4" size="base" className="text-gray-300 mb-2">No se encontraron pedidos</Text>
                <Text variant="body" size="sm" className="text-gray-500">
                  No hay pedidos que coincidan con "{searchOrders}"
                </Text>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 group">
                    {/* Header con número de orden y estado */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Text variant="bodyBold" size="sm" className="text-white group-hover:text-orange-300 transition-colors">
                            {order.orderNumber}
                          </Text>
                          <Text variant="caption" size="xs" className="text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                        order.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        order.status === 'en_proceso' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        order.status === 'completado' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        order.status === 'cancelado' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        'bg-gray-500/20 text-gray-300 border-gray-500/30'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    
                    {/* Información de la tienda */}
                    <div className="mb-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-4 h-4 text-orange-400" />
                        <Text variant="bodyBold" size="xs" className="text-white">
                          {order.storeId?.name || 'Tienda'}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Package2 className="w-4 h-4 text-gray-400" />
                            <Text variant="caption" size="xs" className="text-gray-300">
                              {order.products?.length || 0} productos
                            </Text>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <Text variant="bodyBold" size="xs" className="text-orange-400">
                              ${order.totals?.total || 0}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lista de productos */}
                    {order.products && order.products.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Pizza className="w-4 h-4 text-orange-400" />
                          <Text variant="bodyBold" size="xs" className="text-white">
                            Productos ordenados
                          </Text>
                        </div>
                        <div className="space-y-2">
                          {order.products.slice(0, 3).map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-700/20 rounded-lg border border-gray-600/30">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></span>
                                <Text variant="caption" size="xs" className="text-gray-200 font-medium">
                                  {product.name}
                                </Text>
                              </div>
                              {product.quantity > 1 && (
                                <div className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                                  x{product.quantity}
                                </div>
                              )}
                            </div>
                          ))}
                          {order.products.length > 3 && (
                            <div className="text-center py-2">
                              <Text variant="caption" size="xs" className="text-orange-400 font-medium">
                                +{order.products.length - 3} productos más
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Botón de acción */}
                    <Button
                      onClick={() => handleViewOrderDetail(order._id)}
                      variant="fire"
                      className="w-full group-hover:scale-105 transition-transform duration-200"
                    >
                      Ver Detalle Completo
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Detalle de Pedido */}
      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Text variant="h3" size="base" className="text-white">{selectedOrder.orderNumber}</Text>
                  <Text variant="caption" size="xs" className="text-gray-400">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </Text>
                </div>
              </div>
              <Button onClick={handleCloseOrderDetail} variant="minimal" className="p-2 text-red-400 hover:bg-gray-700 border-none bg-transparent">
                <X size={20} />
              </Button>
            </div>

            {/* Estado del pedido */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                selectedOrder.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-300' :
                selectedOrder.status === 'en_proceso' ? 'bg-blue-500/20 text-blue-300' :
                selectedOrder.status === 'completado' ? 'bg-green-500/20 text-green-300' :
                selectedOrder.status === 'cancelado' ? 'bg-red-500/20 text-red-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                <Clock className="w-4 h-4" />
                {selectedOrder.status}
              </div>
            </div>

            {/* Información del cliente */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <Text variant="bodyBold" size="sm" className="text-white mb-2">Información de Entrega</Text>
              <div className="space-y-1">
                <Text variant="body" size="sm" className="text-gray-300">
                  <span className="text-gray-400">Cliente:</span> {selectedOrder.customer?.name}
                </Text>
                <Text variant="body" size="sm" className="text-gray-300">
                  <span className="text-gray-400">Teléfono:</span> {selectedOrder.customer?.phone}
                </Text>
                {selectedOrder.customer?.location && (
                  <Text variant="body" size="sm" className="text-gray-300">
                    <span className="text-gray-400">Ubicación:</span> {selectedOrder.customer.location.alias}
                  </Text>
                )}
              </div>
            </div>

            {/* Productos */}
            <div className="mb-6">
              <Text variant="bodyBold" size="sm" className="text-white mb-3">Productos</Text>
              <div className="space-y-3">
                {selectedOrder.products?.map((product, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-lg">🍕</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Text variant="bodyBold" size="sm" className="text-white">{product.name}</Text>
                      <Text variant="caption" size="xs" className="text-gray-400">
                        Cantidad: {product.quantity} • ${product.price}
                      </Text>
                      {product.note && (
                        <Text variant="caption" size="xs" className="text-orange-400">
                          Nota: {product.note}
                        </Text>
                      )}
                    </div>
                    <div className="text-right">
                      <Text variant="bodyBold" size="sm" className="text-orange-400">
                        ${(product.price * product.quantity).toFixed(2)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <Text variant="bodyBold" size="sm" className="text-white mb-3">Resumen</Text>
              
              {/* Información del horario y tarifa dinámica */}
              {(() => {
                const orderTime = new Date(selectedOrder.createdAt);
                const deliveryInfo = calculateDeliveryFee(orderTime);
                const currentTimeSlot = getCurrentTimeSlot(orderTime);
                const formattedOrderTime = formatTime(orderTime);
                
                return (
                  <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <Text variant="bodyBold" size="xs" className="text-orange-300">
                        Pedido realizado a las {formattedOrderTime}
                      </Text>
                    </div>
                    <div className="flex items-center justify-between">
                      <Text variant="caption" size="xs" className="text-gray-400">
                        Horario: {currentTimeSlot}
                      </Text>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deliveryInfo.isLateNight 
                          ? 'bg-red-500/20 text-red-300' 
                          : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {deliveryInfo.timeSlot}
                      </div>
                    </div>
                  </div>
                );
              })()}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text variant="body" size="sm" className="text-gray-300">Subtotal:</Text>
                  <Text variant="body" size="sm" className="text-white">${selectedOrder.totals?.subtotal || 0}</Text>
                </div>
                
                {/* Desglose del envío */}
                {(() => {
                  const orderTime = new Date(selectedOrder.createdAt);
                  const deliveryInfo = calculateDeliveryFee(orderTime);
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <Text variant="body" size="sm" className="text-gray-300">Envío base:</Text>
                        <Text variant="body" size="sm" className="text-white">${deliveryInfo.baseFee}</Text>
                      </div>
                      {deliveryInfo.additionalFee > 0 && (
                        <div className="flex justify-between">
                          <Text variant="body" size="sm" className="text-gray-300">
                            Ajuste por horario ({deliveryInfo.timeSlot}):
                          </Text>
                          <Text variant="body" size="sm" className="text-orange-400">+${deliveryInfo.additionalFee}</Text>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gray-600 pt-1">
                        <Text variant="bodyBold" size="sm" className="text-gray-300">Total envío:</Text>
                        <Text variant="bodyBold" size="sm" className="text-orange-400">${deliveryInfo.totalFee}</Text>
                      </div>
                    </>
                  );
                })()}
                
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between">
                    <Text variant="bodyBold" size="sm" className="text-white">Total:</Text>
                    <Text variant="bodyBold" size="sm" className="text-orange-400">${selectedOrder.totals?.total || 0}</Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <Text variant="bodyBold" size="sm" className="text-white mb-2">Método de Pago</Text>
              <Text variant="body" size="sm" className="text-gray-300">
                {selectedOrder.payment?.method || 'No especificado'}
              </Text>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileButton;