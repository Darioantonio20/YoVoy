import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const LoginForm = memo(({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isStore, setIsStore] = useState(false);
  
  // Estados para cliente
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: { alias: '', googleMapsUrl: '' }
  });
  
  // Estados para tienda/admin
  const [storeData, setStoreData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: { alias: '', googleMapsUrl: '' },
    store: {
      name: '',
      responsibleName: '',
      phone: '',
      categories: [],
      description: '',
      images: [],
      location: { alias: '', googleMapsUrl: '' },
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
  
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = () => {
    // Validar campos requeridos
    if (!isLogin) {
      if (isStore) {
        // Validar campos de tienda
        if (!storeData.store.location.alias.trim() || !storeData.store.location.googleMapsUrl.trim()) {
          alert('Por favor, completa el nombre y el vínculo de la ubicación de la tienda');
          return;
        }
        if (storeData.store.categories.length === 0) {
          alert('Por favor, selecciona al menos una categoría');
          return;
        }
        if (!storeData.name.trim() || !storeData.store.name.trim() || !storeData.store.responsibleName.trim()) {
          alert('Por favor, completa el nombre del administrador, de la tienda y del responsable');
          return;
        }
        console.log('Datos de tienda:', { ...storeData, role: 'admin' });
        navigate('/admin');
      } else {
        // Validar campos de cliente
        if (!clientData.location.alias.trim() || !clientData.location.googleMapsUrl.trim()) {
          alert('Por favor, completa el nombre y el vínculo de tu ubicación de entrega');
          return;
        }
        if (!clientData.name.trim() || !clientData.email.trim() || !clientData.password.trim() || !clientData.phone.trim()) {
          alert('Por favor, completa todos los campos requeridos');
          return;
        }
        console.log('Datos de cliente:', { ...clientData, role: 'client' });
        navigate('/store');
      }
    } else {
      navigate('/store');
    }
  };

  return (
    <div
      className={`${isLogin ? 'max-w-[900px]' : 'max-w-[800px]'} w-full mx-auto bg-[#0d1b2a] rounded-lg shadow-2xl p-4 sm:p-8 md:p-10 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}
    >
      {/* Botón de back */}
      {onBack && (
        <div className='mb-2 sm:mb-4'>
          <button
            type='button'
            onClick={onBack}
            className='flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40'
            aria-label='Volver'
          >
            <ArrowLeft size={16} className='sm:w-5 sm:h-5' />
          </button>
        </div>
      )}
      <div className='text-center mb-4 sm:mb-6 opacity-70'>
        {isLogin && (
          <div className='w-16 h-16 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 border border-white/20'>
            <User size={24} className='sm:w-6 sm:h-6 text-white' />
          </div>
        )}
        <Text
          variant='h2'
          size='xl'
          className='sm:text-2xl text-gray-50 mb-2 sm:mb-3'
        >
          {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
        </Text>
      </div>

      <div className='space-y-6 sm:space-y-8'>
        {isLogin ? (
          // Formulario de Login
          <>
            <div>
              <label className='block mb-3 sm:mb-3 text-gray-50 text-sm sm:text-base font-medium'>
                Email
              </label>
              <input
                type='email'
                placeholder='tu@email.com'
                value={clientData.email}
                onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                className='w-full p-4 sm:p-4 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
              />
            </div>
            <div>
              <label className='block mb-3 sm:mb-3 text-gray-50 text-sm sm:text-base font-medium'>
                Contraseña
              </label>
              <input
                type='password'
                placeholder='••••••••'
                value={clientData.password}
                onChange={(e) => setClientData(prev => ({ ...prev, password: e.target.value }))}
                className='w-full p-4 sm:p-4 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
              />
            </div>
          </>
        ) : (
          // Formulario de Registro
          <>
            {isStore ? (
              <div className='space-y-6'>
                {/* Información del administrador */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      1. Nombre del administrador
                    </label>
                    <input
                      type='text'
                      placeholder='Nombre del administrador'
                      value={storeData.name}
                      onChange={(e) => setStoreData(prev => ({ 
                        ...prev, 
                        name: e.target.value
                      }))}
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                  </div>
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      2. Email
                    </label>
                    <input
                      type='email'
                      placeholder='admin@tienda.com'
                      value={storeData.email}
                      onChange={(e) => setStoreData(prev => ({ ...prev, email: e.target.value }))}
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                  </div>
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      3. Contraseña
                    </label>
                    <input
                      type='password'
                      placeholder='••••••••'
                      value={storeData.password}
                      onChange={(e) => setStoreData(prev => ({ ...prev, password: e.target.value }))}
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                  </div>
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      4. Número telefónico
                    </label>
                    <input
                      type='tel'
                      placeholder='+1 (555) 123-4567'
                      value={storeData.phone}
                      onChange={(e) => setStoreData(prev => ({ ...prev, phone: e.target.value }))}
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                  </div>
                </div>
                
                {/* Información de la tienda */}
                <div className='space-y-4'>
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      5. Nombre de la tienda
                    </label>
                    <input
                      type='text'
                      placeholder='Nombre de tu tienda'
                      value={storeData.store.name}
                      onChange={(e) => setStoreData(prev => ({ 
                        ...prev, 
                        store: { ...prev.store, name: e.target.value }
                      }))}
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                  </div>
                  
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      6. Nombre del responsable de la tienda
                    </label>
                    <input
                      type='text'
                      placeholder='Nombre del responsable de la tienda'
                      value={storeData.store.responsibleName}
                      onChange={(e) => setStoreData(prev => ({ 
                        ...prev, 
                        store: { ...prev.store, responsibleName: e.target.value }
                      }))}
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                  </div>
                  
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      7. Descripción de la tienda
                    </label>
                    <textarea
                      placeholder='Describe tu tienda y los productos que ofreces'
                      value={storeData.store.description}
                      onChange={(e) => setStoreData(prev => ({ 
                        ...prev, 
                        store: { ...prev.store, description: e.target.value }
                      }))}
                      rows='3'
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base'
                    />
                  </div>
                  
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      8. Teléfono de la tienda
                    </label>
                    <input
                      type='tel'
                      placeholder='+1 (555) 123-4567'
                      value={storeData.store.phone}
                      onChange={(e) => setStoreData(prev => ({ 
                        ...prev, 
                        store: { ...prev.store, phone: e.target.value }
                      }))}
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                  </div>
                  
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      9. Ubicación exacta de la tienda
                    </label>
                    <div className='mb-3'>
                      <button
                        type='button'
                        onClick={() => window.open('https://www.google.com/maps', '_blank')}
                        className='flex items-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-300 hover:text-orange-200 transition-colors text-xs'
                      >
                        <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Abrir Google Maps
                      </button>
                      <div className='mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300/90'>
                        <div className='space-y-1'>
                          <p className='font-medium text-blue-300'>📍 Instrucciones:</p>
                          <p>1. Busca tu local en Google Maps</p>
                          <p>2. Busca el icono de compartir</p>
                          <p>3. Dale clic en copiar vínculo</p>
                          <p>4. Pégala en el campo requerido</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={storeData.store.location.alias}
                        onChange={(e) => setStoreData(prev => ({ 
                          ...prev, 
                          store: { 
                            ...prev.store, 
                            location: { ...prev.store.location, alias: e.target.value }
                          }
                        }))}
                        placeholder="Nombre de la ubicación (ej: Sucursal Centro, Local Principal)"
                        className='w-full border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                      />
                      <textarea
                        value={storeData.store.location.googleMapsUrl}
                        onChange={(e) => setStoreData(prev => ({ 
                          ...prev, 
                          store: { 
                            ...prev.store, 
                            location: { ...prev.store.location, googleMapsUrl: e.target.value }
                          }
                        }))}
                        placeholder='Pega aquí el vínculo de Google Maps'
                        rows='2'
                        className='w-full border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base'
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className='block mb-3 text-gray-50 text-sm font-medium'>
                      10. Categorías de productos
                      <span className='text-gray-400 text-xs ml-2'>(Selecciona las que apliquen)</span>
                    </label>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                      {[
                        { id: 'tecnologia', label: 'Tecnología', icon: '💻' },
                        { id: 'moda', label: 'Moda', icon: '👕' },
                        { id: 'juguetes', label: 'Juguetes', icon: '🧸' },
                        { id: 'comida', label: 'Comida', icon: '🍔' },
                        { id: 'hogar', label: 'Hogar', icon: '🏠' },
                        { id: 'jardin', label: 'Jardín', icon: '🌱' },
                        { id: 'mascotas', label: 'Mascotas', icon: '🐕' },
                        { id: 'deportes', label: 'Deportes', icon: '⚽' },
                        { id: 'belleza', label: 'Belleza', icon: '💄' },
                        { id: 'libros', label: 'Libros', icon: '📚' },
                        { id: 'musica', label: 'Música', icon: '🎵' },
                        { id: 'arte', label: 'Arte', icon: '🎨' },
                        { id: 'automotriz', label: 'Automotriz', icon: '🚗' },
                        { id: 'ferreteria', label: 'Ferretería', icon: '🔧' },
                      ].map(category => (
                        <label
                          key={category.id}
                          className='relative flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group'
                        >
                          <input
                            type='checkbox'
                            name='categories'
                            value={category.id}
                            checked={storeData.store.categories.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStoreData(prev => ({
                                  ...prev,
                                  store: {
                                    ...prev.store,
                                    categories: [...prev.store.categories, category.id]
                                  }
                                }));
                              } else {
                                setStoreData(prev => ({
                                  ...prev,
                                  store: {
                                    ...prev.store,
                                    categories: prev.store.categories.filter(id => id !== category.id)
                                  }
                                }));
                              }
                            }}
                            className='peer sr-only'
                          />
                          <div
                            className='w-7 h-7 rounded-lg bg-transparent border-2 border-orange-500/70 transition-all duration-300 ease-in-out
                              peer-checked:bg-gradient-to-br from-orange-400 to-yellow-400
                              peer-checked:border-0 peer-checked:rotate-12
                              after:content-[""] after:absolute after:top-[22px] after:left-[14px]
                              after:-translate-x-1/2 after:-translate-y-1/2 after:w-4 after:h-4
                              after:opacity-0 after:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=")]
                              after:bg-contain after:bg-no-repeat peer-checked:after:opacity-100
                              after:transition-opacity after:duration-300
                              hover:shadow-[0_0_15px_rgba(251,146,60,0.5)]'
                          ></div>
                          <div className='flex items-center gap-2 ml-3'>
                            <span className='text-xl'>{category.icon}</span>
                            <span className='text-sm text-white/90 group-hover:text-white transition-colors'>
                              {category.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className='block mb-3 text-gray-50 text-sm font-medium'>
                      11. Horarios de la tienda
                      <span className='text-gray-400 text-xs ml-2'>(Configura los horarios de atención en formato 24h)</span>
                    </label>
                    
                    {/* Botones de configuración rápida */}
                    <div className='mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
                      <p className='text-xs text-orange-300/90 mb-2 font-medium'>⚡ Configuración rápida:</p>
                      <div className='flex flex-wrap gap-2'>
                        <button
                          type='button'
                          onClick={() => {
                            const quickSchedule = storeData.store.schedule.map(day => ({
                              ...day,
                              isOpen: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].includes(day.day),
                              openTime: '09:00',
                              closeTime: '18:00'
                            }));
                            setStoreData(prev => ({
                              ...prev,
                              store: { ...prev.store, schedule: quickSchedule }
                            }));
                          }}
                          className='px-3 py-1.5 text-xs bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded text-orange-300 hover:text-orange-200 transition-colors'
                        >
                          Lunes a Viernes 9:00-18:00
                        </button>
                        <button
                          type='button'
                          onClick={() => {
                            const quickSchedule = storeData.store.schedule.map(day => ({
                              ...day,
                              isOpen: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].includes(day.day),
                              openTime: '08:00',
                              closeTime: '20:00'
                            }));
                            setStoreData(prev => ({
                              ...prev,
                              store: { ...prev.store, schedule: quickSchedule }
                            }));
                          }}
                          className='px-3 py-1.5 text-xs bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded text-orange-300 hover:text-orange-200 transition-colors'
                        >
                          Lunes a Sábado 8:00-20:00
                        </button>
                        <button
                          type='button'
                          onClick={() => {
                            const quickSchedule = storeData.store.schedule.map(day => ({
                              ...day,
                              isOpen: false,
                              openTime: '00:00',
                              closeTime: '00:00'
                            }));
                            setStoreData(prev => ({
                              ...prev,
                              store: { ...prev.store, schedule: quickSchedule }
                            }));
                          }}
                          className='px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-300 hover:text-red-200 transition-colors'
                        >
                          Cerrar todos
                        </button>
                      </div>
                    </div>
                    
                    {/* Horarios individuales */}
                    <div className='space-y-3'>
                      {storeData.store.schedule.map((day, index) => (
                        <div key={day.day} className='flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10'>
                          {/* Día y checkbox */}
                          <div className='flex items-center gap-3 min-w-[140px]'>
                            <input
                              type='checkbox'
                              checked={day.isOpen}
                              onChange={(e) => {
                                const updatedSchedule = [...storeData.store.schedule];
                                updatedSchedule[index] = {
                                  ...updatedSchedule[index],
                                  isOpen: e.target.checked,
                                  openTime: e.target.checked ? '09:00' : '00:00',
                                  closeTime: e.target.checked ? '18:00' : '00:00'
                                };
                                setStoreData(prev => ({
                                  ...prev,
                                  store: {
                                    ...prev.store,
                                    schedule: updatedSchedule
                                  }
                                }));
                              }}
                              className='w-5 h-5 text-orange-500 bg-transparent border-2 border-orange-500/70 rounded focus:ring-orange-500/50 focus:ring-2'
                            />
                            <span className='text-sm text-white/90 font-medium'>{day.day}</span>
                          </div>
                          
                          {/* Horarios */}
                          {day.isOpen ? (
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1'>
                              <div className='flex items-center gap-2'>
                                <span className='text-xs text-white/70 font-medium'>Apertura:</span>
                                <input
                                  type='time'
                                  value={day.openTime}
                                  onChange={(e) => {
                                    const updatedSchedule = [...storeData.store.schedule];
                                    updatedSchedule[index] = {
                                      ...updatedSchedule[index],
                                      openTime: e.target.value
                                    };
                                    setStoreData(prev => ({
                                      ...prev,
                                      store: {
                                        ...prev.store,
                                        schedule: updatedSchedule
                                      }
                                    }));
                                  }}
                                  className='px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50'
                                />
                              </div>
                              <div className='flex items-center gap-2'>
                                <span className='text-xs text-white/70 font-medium'>Cierre:</span>
                                <input
                                  type='time'
                                  value={day.closeTime}
                                  onChange={(e) => {
                                    const updatedSchedule = [...storeData.store.schedule];
                                    updatedSchedule[index] = {
                                      ...updatedSchedule[index],
                                      closeTime: e.target.value
                                    };
                                    setStoreData(prev => ({
                                      ...prev,
                                      store: {
                                        ...prev.store,
                                        schedule: updatedSchedule
                                      }
                                    }));
                                  }}
                                  className='px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50'
                                />
                              </div>
                              <div className='flex items-center gap-2'>
                                <span className='text-xs text-orange-400/80 font-medium'>
                                  {day.openTime} - {day.closeTime}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className='flex items-center gap-2'>
                              <span className='text-xs text-white/50 italic'>Cerrado</span>
                              <div className='w-16 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center'>
                                <span className='text-xs text-white/30'>--:--</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Información adicional */}
                    <div className='mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300/90'>
                      <p className='font-medium text-blue-300'>💡 Consejos:</p>
                      <ul className='mt-1 space-y-1 text-blue-300/80'>
                        <li>• Usa formato 24 horas (ej: 14:30 para 2:30 PM)</li>
                        <li>• Los horarios se guardan automáticamente</li>
                        <li>• Puedes usar los botones de configuración rápida</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Formulario de cliente
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                <div>
                  <label className='block mb-2 text-gray-50 text-sm font-medium'>
                    1. Nombre completo
                  </label>
                  <input
                    type='text'
                    placeholder='Tu nombre completo'
                    value={clientData.name}
                    onChange={(e) => setClientData(prev => ({ ...prev, name: e.target.value }))}
                    className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div>
                  <label className='block mb-2 text-gray-50 text-sm font-medium'>
                    2. Email
                  </label>
                  <input
                    type='email'
                    placeholder='tu@email.com'
                    value={clientData.email}
                    onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                    className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div>
                  <label className='block mb-2 text-gray-50 text-sm font-medium'>
                    3. Contraseña
                  </label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    value={clientData.password}
                    onChange={(e) => setClientData(prev => ({ ...prev, password: e.target.value }))}
                    className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div>
                  <label className='block mb-2 text-gray-50 text-sm font-medium'>
                    4. Número telefónico
                  </label>
                  <input
                    type='tel'
                    placeholder='+1 (555) 123-4567'
                    value={clientData.phone}
                    onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                    className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block mb-2 text-gray-50 text-sm font-medium'>
                    5. Ubicación para envío
                  </label>
                  <div className='mb-3'>
                    <button
                      type='button'
                      onClick={() => window.open('https://www.google.com/maps', '_blank')}
                      className='flex items-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-300 hover:text-orange-200 transition-colors text-xs'
                    >
                      <svg className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Abrir Google Maps
                    </button>
                    <div className='mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300/90'>
                      <div className='space-y-1'>
                        <p className='font-medium text-blue-300'>📍 Instrucciones:</p>
                        <p>1. Busca tu ubicación de entrega en Google Maps</p>
                        <p>2. Busca el ícono de compartir</p>
                        <p>3. Dale clic en copiar vínculo</p>
                        <p>4. Pégala en el campo requerido</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={clientData.location.alias}
                      onChange={(e) => setClientData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, alias: e.target.value }
                      }))}
                      placeholder="Nombre del lugar (ej: Casa, Trabajo, Gimnasio)"
                      className='w-full border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                    <textarea
                      value={clientData.location.googleMapsUrl}
                      onChange={(e) => setClientData(prev => ({ 
                        ...prev, 
                        location: { ...prev.location, googleMapsUrl: e.target.value }
                      }))}
                      placeholder='Pega aquí el vínculo de Google Maps'
                      rows='2'
                      className='w-full border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base'
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className='space-y-5 sm:space-y-5'>
          <Button
            variant='fire'
            className='w-full p-4 sm:p-4 text-sm sm:text-base'
            onClick={handleSubmit}
          >
            {isLogin
              ? 'Iniciar Sesión'
              : isStore
                ? 'Crear Cuenta'
                : 'Crear Cuenta'}
          </Button>

          {isLogin && (
            <>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-600'></div>
                </div>
                <div className='relative flex justify-center text-xs sm:text-sm'>
                  <span className='px-2 sm:px-3 bg-[#0d1b2a] text-gray-400'>
                    o
                  </span>
                </div>
              </div>

              <Button
                variant='minimal'
                className='w-full p-4 sm:p-4 border-white/50 text-white hover:bg-white hover:text-gray-700 text-sm sm:text-base'
                onClick={toggleForm}
              >
                Crear Cuenta
              </Button>
            </>
          )}

          {/* Botón leyenda para crear cuenta como tienda, solo en registro personal */}
          {!isLogin && !isStore && (
            <button
              type='button'
              className='block w-full text-sm text-orange-400 mt-2 sm:mt-2 hover:underline text-center'
              onClick={() => setIsStore(true)}
            >
              ¿Eres una tienda? Crear cuenta como tienda
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
