import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X, Settings, LogOut, Edit3, ChevronDown, MapPin, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import Text from './Text';
import Button from './Button';
import Alert from './Alert';

const UserProfileButton = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({
    fullName: 'ejemplo',
    phone: '+52 961 479 5678',
    password: 'pass123',
    locations: [
      { id: 1, address: 'Av. Insurgentes Sur 123, CDMX', isCurrent: true },
      { id: 2, address: 'Calle Reforma 456, Guadalajara', isCurrent: false },
      { id: 3, address: 'Plaza Mayor 789, Monterrey', isCurrent: false }
    ]
  });
  const [newLocation, setNewLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingLocationText, setEditingLocationText] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsOpen(false);
    const result = await Alert.confirm(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión? Perderás acceso a tu cuenta hasta que vuelvas a iniciar sesión.'
    );
    
    if (result.isConfirmed) {
      navigate('/');
    }
  };

  const handleEditProfile = () => {
    setIsOpen(false);
    setShowEditModal(true);
  };

  const handleSettings = async () => {
    setIsOpen(false);
    await Alert.info(
      'Configuración',
      'Próximamente podrás personalizar tus preferencias, ajustar notificaciones y configurar la privacidad de tu cuenta.'
    );
  };

  const handleSaveProfile = async () => {
    setShowEditModal(false);
    await Alert.success(
      'Perfil Actualizado',
      'Tu información personal ha sido actualizada exitosamente.'
    );
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleUpdateUserData = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      const newId = Math.max(...userData.locations.map(l => l.id)) + 1;
      setUserData(prev => ({
        ...prev,
        locations: [
          ...prev.locations,
          { id: newId, address: newLocation.trim(), isCurrent: false }
        ]
      }));
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (id) => {
    setUserData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== id)
    }));
  };

  const handleSetCurrentLocation = (id) => {
    setUserData(prev => ({
      ...prev,
      locations: prev.locations.map(loc => ({
        ...loc,
        isCurrent: loc.id === id
      }))
    }));
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location.id);
    setEditingLocationText(location.address);
  };

  const handleSaveLocationEdit = () => {
    if (editingLocationText.trim()) {
      setUserData(prev => ({
        ...prev,
        locations: prev.locations.map(loc => 
          loc.id === editingLocation 
            ? { ...loc, address: editingLocationText.trim() }
            : loc
        )
      }));
      setEditingLocation(null);
      setEditingLocationText('');
    }
  };

  const handleCancelLocationEdit = () => {
    setEditingLocation(null);
    setEditingLocationText('');
  };

  return (
    <>
      {/* Botón de perfil - Posicionado debajo del carrito */}
      <div
        className={`fixed z-50 group right-6 top-28 ${className}`}
      >
        <div className='relative'>
          {/* Botón principal */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-14 h-14 
              bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 
              hover:from-orange-600 hover:via-orange-700 hover:to-red-600 
              rounded-full flex items-center justify-center 
              shadow-lg hover:shadow-xl 
              transition-all duration-300 ease-out
              group-hover:scale-110 group-hover:rotate-3
              backdrop-blur-sm
              active:scale-95
              ${isOpen ? 'ring-4 ring-orange-400 ring-opacity-75' : ''}
            `}
          >
            <User className='w-6 h-6 text-white drop-shadow-sm' />
          </button>

          {/* Indicador de menú */}
          <div
            className={`
            absolute -bottom-1 -right-1 
            w-5 h-5 
            bg-gradient-to-br from-orange-400 to-orange-500
            text-white text-xs font-bold 
            rounded-full flex items-center justify-center 
            shadow-lg
            transition-all duration-300
            ${isOpen ? 'rotate-180' : ''}
          `}
          >
            <ChevronDown className='w-3 h-3' />
          </div>
        </div>
      </div>

      {/* Menú desplegable */}
      {isOpen && (
        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)}>
          <div
            className='menu-content absolute bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-4 min-w-64 max-w-80 transform transition-all duration-300 ease-out right-4 top-40 sm:right-6 md:right-6 lg:right-6'
            onClick={e => e.stopPropagation()}
          >
            {/* Header del menú */}
            <div className='flex items-center justify-between mb-4 pb-3 border-b border-gray-700'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                  <User className='w-5 h-5 text-white' />
                </div>
                <div>
                  <Text variant='h3' size='base' className='text-white'>
                    Mi Perfil
                  </Text>
                  <Text variant='caption' size='sm' className='text-gray-400'>
                    Usuario
                  </Text>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant='danger'
                className='p-2 text-gray-400 hover:text-gray-200 border-none bg-transparent'
              >
                <X size={10} />
              </Button>
            </div>

            {/* Opciones del menú */}
            <div className='space-y-2'>
              <Button
                onClick={handleEditProfile}
                variant='minimal'
                className='w-full flex items-center gap-3 px-3 py-3 text-left text-gray-200 hover:bg-gray-800 rounded-xl border-none bg-transparent'
              >
                <div className='w-8 h-8 bg-orange-900/50 rounded-lg flex items-center justify-center group-hover:bg-orange-800/70 transition-colors'>
                  <Edit3 className='w-4 h-4 text-orange-400' />
                </div>
                <div>
                  <Text variant='bodyBold' size='sm' className='text-white'>
                    Editar Perfil
                  </Text>
                  <Text variant='caption' size='xs' className='text-gray-400'>
                    Modificar datos personales
                  </Text>
                </div>
              </Button>

              <Button
                onClick={handleSettings}
                variant='minimal'
                className='w-full flex items-center gap-3 px-3 py-3 text-left text-gray-200 hover:bg-gray-800 rounded-xl border-none bg-transparent'
              >
                <div className='w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors'>
                  <Settings className='w-4 h-4 text-gray-400' />
                </div>
                <div>
                  <Text variant='bodyBold' size='sm' className='text-white'>
                    Configuración
                  </Text>
                  <Text variant='caption' size='xs' className='text-gray-400'>
                    Preferencias y ajustes
                  </Text>
                </div>
              </Button>

              <div className='border-t border-gray-700 pt-2'>
                <Button
                  onClick={handleLogout}
                  variant='minimal'
                  className='w-full flex items-center gap-3 px-3 py-3 text-left text-red-400 hover:bg-red-900/30 rounded-xl border-none bg-transparent'
                >
                  <div className='w-8 h-8 bg-red-900/50 rounded-lg flex items-center justify-center group-hover:bg-red-800/70 transition-colors'>
                    <LogOut className='w-4 h-4 text-red-400' />
                  </div>
                  <div>
                    <Text variant='bodyBold' size='sm' className='text-red-300'>
                      Cerrar Sesión
                    </Text>
                    <Text variant='caption' size='xs' className='text-red-400'>
                      Salir de la aplicación
                    </Text>
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
                <Text variant="h3" size="base" className="text-white">
                  Editar Perfil
                </Text>
              </div>
              <Button
                onClick={handleCancelEdit}
                variant="minimal"
                className="p-2 text-red-400 hover:text-gray-200 border-none bg-transparent"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Formulario */}
            <div className="space-y-4 sm:space-y-6">
              {/* Nombre completo */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">
                  Nombre Completo
                </Text>
                <input
                  type="text"
                  value={userData.fullName}
                  onChange={(e) => handleUpdateUserData('fullName', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              {/* Número de teléfono */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">
                  Número de Teléfono
                </Text>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleUpdateUserData('phone', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="+52 55 1234 5678"
                />
              </div>

              {/* Contraseña */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">
                  Contraseña
                </Text>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={userData.password}
                    onChange={(e) => handleUpdateUserData('password', e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Ubicaciones */}
              <div>
                <Text variant="bodyBold" size="sm" className="text-white mb-2">
                  Ubicaciones
                </Text>
                
                {/* Formulario simple para Mobile */}
                <div className="sm:hidden space-y-4 mb-4">
                  {/* Ubicación actual */}
                  <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-orange-400" />
                      <Text variant="bodyBold" size="sm" className="text-white">
                        Ubicación Actual
                      </Text>
                    </div>
                    <div className="space-y-3">
                      {userData.locations.filter(loc => loc.isCurrent).map((location) => (
                        <div key={location.id} className="bg-gray-700 rounded-lg p-3">
                          <Text variant="body" size="sm" className="text-white leading-relaxed">
                            {location.address}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Otras ubicaciones */}
                  <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <Text variant="bodyBold" size="sm" className="text-white">
                          Otras Ubicaciones
                        </Text>
                      </div>
                      <Text variant="caption" size="xs" className="text-gray-400">
                        {userData.locations.filter(loc => !loc.isCurrent).length} ubicaciones
                      </Text>
                    </div>
                    
                    <div className="space-y-2">
                      {userData.locations.filter(loc => !loc.isCurrent).map((location) => (
                        <div key={location.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div className="flex-1">
                            <Text variant="body" size="sm" className="text-white leading-relaxed">
                              {location.address}
                            </Text>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            <Button
                              onClick={() => handleSetCurrentLocation(location.id)}
                              variant="minimal"
                              className="px-3 py-1 text-orange-400 hover:text-orange-300 border-orange-500 text-xs"
                            >
                              Cambiar
                            </Button>
                            <Button
                              onClick={() => handleRemoveLocation(location.id)}
                              variant="minimal"
                              className="px-2 py-1 text-red-400 hover:text-red-300 border-red-500"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agregar nueva ubicación */}
                  <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Plus className="w-5 h-5 text-green-400" />
                      <Text variant="bodyBold" size="sm" className="text-white">
                        Agregar Nueva Ubicación
                      </Text>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        placeholder="Ingresa la dirección completa"
                      />
                      <Button
                        onClick={handleAddLocation}
                        variant="fire"
                        className="w-full py-3"
                        disabled={!newLocation.trim()}
                      >
                        <Text variant="bodyBold" size="sm">Agregar Ubicación</Text>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de ubicaciones existentes - Desktop */}
                <div className="hidden sm:block space-y-2 mb-4 max-h-40 overflow-y-auto">
                  {userData.locations.map((location) => (
                    <div key={location.id} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800 rounded-lg border border-gray-600">
                      <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      
                      {/* Contenido de la ubicación */}
                      {editingLocation === location.id ? (
                        // Modo edición
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingLocationText}
                            onChange={(e) => setEditingLocationText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveLocationEdit()}
                            className="flex-1 px-3 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                            placeholder="Editar ubicación"
                          />
                          <Button
                            onClick={handleSaveLocationEdit}
                            variant="minimal"
                            className="p-1 text-green-400 hover:text-green-300 border-none bg-transparent"
                          >
                            <Text variant="caption" size="xs">✓</Text>
                          </Button>
                          <Button
                            onClick={handleCancelLocationEdit}
                            variant="minimal"
                            className="p-1 text-gray-400 hover:text-gray-300 border-none bg-transparent"
                          >
                            <Text variant="caption" size="xs">✕</Text>
                          </Button>
                        </div>
                      ) : (
                        // Modo visualización
                        <div className="flex-1 min-w-0">
                          <Text variant="body" size="sm" className="text-white truncate">
                            {location.address}
                          </Text>
                        </div>
                      )}
                      
                      {/* Botones de acción */}
                      <div className="flex items-center gap-1">
                        {location.isCurrent && (
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                            Actual
                          </span>
                        )}
                        {!location.isCurrent && (
                          <Button
                            onClick={() => handleSetCurrentLocation(location.id)}
                            variant="minimal"
                            className="p-1 text-orange-400 hover:text-orange-300 border-none bg-transparent"
                          >
                            <Text variant="caption" size="xs">Actual</Text>
                          </Button>
                        )}
                        {editingLocation !== location.id && (
                          <Button
                            onClick={() => handleEditLocation(location)}
                            variant="minimal"
                            className="p-1 text-blue-400 hover:text-blue-300 border-none bg-transparent"
                          >
                            <Edit3 size={14} />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleRemoveLocation(location.id)}
                          variant="minimal"
                          className="p-1 text-red-400 hover:text-red-300 border-none bg-transparent"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Agregar nueva ubicación - Desktop */}
                <div className="hidden sm:flex gap-2">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Agregar nueva ubicación"
                  />
                  <Button
                    onClick={handleAddLocation}
                    variant="fire"
                    className="px-4 py-3"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 border-t border-gray-700">
              <Button
                onClick={handleCancelEdit}
                variant="danger"
                className="flex-1 border-gray-600 text-gray-300 hover:text-white text-sm sm:text-base py-2 sm:py-3"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveProfile}
                variant="fire"
                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileButton;
