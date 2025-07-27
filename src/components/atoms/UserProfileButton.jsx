import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X, Settings, LogOut, Edit3, ChevronDown } from 'lucide-react';
import Text from './Text';
import Button from './Button';
import Alert from './Alert';

const UserProfileButton = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleEditProfile = async () => {
    setIsOpen(false);
    await Alert.info(
      'Editar Perfil',
      'Próximamente podrás editar tu información personal, cambiar tu foto de perfil y actualizar tus datos de contacto.'
    );
  };

  const handleSettings = async () => {
    setIsOpen(false);
    await Alert.info(
      'Configuración',
      'Próximamente podrás personalizar tus preferencias, ajustar notificaciones y configurar la privacidad de tu cuenta.'
    );
  };

  return (
    <>
      {/* Botón de perfil - Posicionado debajo del carrito */}
      <div
        className={`fixed z-50 group right-4 top-28 sm:right-6 md:right-6 lg:right-6 ${className}`}
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
    </>
  );
};

export default UserProfileButton;
