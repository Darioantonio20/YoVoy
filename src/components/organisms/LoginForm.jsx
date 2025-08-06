import { memo, useState } from 'react';
import { User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = memo(({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isStore, setIsStore] = useState(false);

  // Estados para controlar visibilidad de contraseñas
  const [showClientPassword, setShowClientPassword] = useState(false);
  const [showStorePassword, setShowStorePassword] = useState(false);

  
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
  
  const { login, register, isLoading } = useAuth();
  
  // Estados para errores
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setGeneralError('');
  };

  const toggleStoreForm = () => {
    setIsStore(!isStore);
    setErrors({});
    setGeneralError('');
  };

  // Función para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar teléfono
  const validatePhone = (phone) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 15;
  };

  // Función para validar URL de Google Maps
  const validateGoogleMapsUrl = (url) => {
    return url.startsWith('https://maps.app.goo.gl/') || url.startsWith('https://goo.gl/maps/');
  };

  // Función para validar contraseña
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Función para validar nombre
  const validateName = (name) => {
    return name.length <= 100;
  };

  // Función para validar alias de ubicación
  const validateLocationAlias = (alias) => {
    return alias.length <= 200;
  };

  // Función para limpiar errores
  const clearErrors = () => {
    setErrors({});
    setGeneralError('');
  };

  // Función para manejar el login
  const handleLogin = async () => {
    clearErrors();
    
    // Validar campos requeridos
    if (!clientData.email.trim() || !clientData.password.trim()) {
      setGeneralError('Por favor proporciona email y contraseña');
      return;
    }

    // Validar formato de email
    if (!validateEmail(clientData.email)) {
      setErrors(prev => ({ ...prev, email: 'Por favor agrega un email válido' }));
      return;
    }

    const result = await login(clientData.email, clientData.password);
    
    if (!result.success) {
      // Manejar errores específicos del backend
      if (result.error === 'Credenciales inválidas') {
        setGeneralError('Credenciales inválidas');
      } else {
        setGeneralError(result.error || 'Error al iniciar sesión');
      }
    }
  };

  // Función para manejar el registro de cliente
  const handleClientRegister = async () => {
    clearErrors();
    
    // Validar campos requeridos
    if (!clientData.name.trim() || !clientData.email.trim() || !clientData.password.trim() || !clientData.phone.trim()) {
      setGeneralError('Por favor completa todos los campos requeridos');
      return;
    }
    
    if (!clientData.location.alias.trim() || !clientData.location.googleMapsUrl.trim()) {
      setGeneralError('Por favor proporciona el alias y el enlace de Google Maps para la ubicación');
      return;
    }

    // Validaciones específicas
    if (!validateName(clientData.name)) {
      setErrors(prev => ({ ...prev, name: 'El nombre no puede tener más de 100 caracteres' }));
      return;
    }

    if (!validateEmail(clientData.email)) {
      setErrors(prev => ({ ...prev, email: 'Por favor agrega un email válido' }));
      return;
    }

    if (!validatePassword(clientData.password)) {
      setErrors(prev => ({ ...prev, password: 'La contraseña debe tener al menos 6 caracteres' }));
      return;
    }

    if (!validatePhone(clientData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'El número telefónico debe estar en formato internacional (Ej: +529614795475)' }));
      return;
    }

    if (!validateLocationAlias(clientData.location.alias)) {
      setErrors(prev => ({ ...prev, locationAlias: 'El alias de ubicación no puede tener más de 200 caracteres' }));
      return;
    }

    if (!validateGoogleMapsUrl(clientData.location.googleMapsUrl)) {
      setErrors(prev => ({ ...prev, googleMapsUrl: 'El enlace de Google Maps proporcionado no es válido' }));
      return;
    }

    const userData = {
      name: clientData.name,
      email: clientData.email,
      password: clientData.password,
      phone: clientData.phone,
      location: clientData.location,
      role: 'client'
    };

    const result = await register(userData);
    
    if (result.success) {
      // Limpiar formulario y cambiar a login
      setClientData({
        name: '',
        email: '',
        password: '',
        phone: '',
        location: { alias: '', googleMapsUrl: '' }
      });
      setIsLogin(true);
    } else {
      // Manejar errores específicos del backend
      if (result.error.includes('E11000 duplicate key error')) {
        setErrors(prev => ({ ...prev, email: 'Este email ya está registrado' }));
      } else {
        setGeneralError(result.error || 'Error al registrar usuario');
      }
    }
  };

  // Función para manejar el registro de admin/tienda
  const handleStoreRegister = async () => {
    clearErrors();
    
    // Validar campos requeridos del administrador
    if (!storeData.name.trim() || !storeData.email.trim() || !storeData.password.trim() || !storeData.phone.trim()) {
      setGeneralError('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Validar campos de la tienda
    if (!storeData.store.name.trim() || !storeData.store.responsibleName.trim()) {
      setGeneralError('La información de la tienda es requerida para cuentas de administrador');
      return;
    }
    
    if (!storeData.store.location.alias.trim() || !storeData.store.location.googleMapsUrl.trim()) {
      setGeneralError('Por favor proporciona el alias y el enlace de Google Maps para la ubicación');
      return;
    }
    
    if (storeData.store.categories.length === 0) {
      setGeneralError('Debe seleccionar al menos una categoría para la tienda');
      return;
    }

    // Validaciones específicas del administrador
    if (!validateName(storeData.name)) {
      setErrors(prev => ({ ...prev, adminName: 'El nombre no puede tener más de 100 caracteres' }));
      return;
    }

    if (!validateEmail(storeData.email)) {
      setErrors(prev => ({ ...prev, adminEmail: 'Por favor agrega un email válido' }));
      return;
    }

    if (!validatePassword(storeData.password)) {
      setErrors(prev => ({ ...prev, adminPassword: 'La contraseña debe tener al menos 6 caracteres' }));
      return;
    }

    if (!validatePhone(storeData.phone)) {
      setErrors(prev => ({ ...prev, adminPhone: 'El número telefónico debe estar en formato internacional (Ej: +529614795475)' }));
      return;
    }

    // Validaciones específicas de la tienda
    if (!validateName(storeData.store.name)) {
      setErrors(prev => ({ ...prev, storeName: 'El nombre de la tienda no puede tener más de 100 caracteres' }));
      return;
    }

    if (!validateName(storeData.store.responsibleName)) {
      setErrors(prev => ({ ...prev, responsibleName: 'El nombre del responsable no puede tener más de 100 caracteres' }));
      return;
    }

    if (!validatePhone(storeData.store.phone)) {
      setErrors(prev => ({ ...prev, storePhone: 'El número telefónico de la tienda debe estar en formato internacional (Ej: +529614795475)' }));
      return;
    }

    if (!validateLocationAlias(storeData.store.location.alias)) {
      setErrors(prev => ({ ...prev, storeLocationAlias: 'El alias de ubicación no puede tener más de 200 caracteres' }));
      return;
    }

    if (!validateGoogleMapsUrl(storeData.store.location.googleMapsUrl)) {
      setErrors(prev => ({ ...prev, storeGoogleMapsUrl: 'El enlace de Google Maps proporcionado no es válido' }));
      return;
    }

    // Validar horario completo
    if (storeData.store.schedule.length !== 7) {
      setGeneralError('Debe proporcionar el horario para todos los días de la semana');
      return;
    }

    const userData = {
      name: storeData.name,
      email: storeData.email,
      password: storeData.password,
      phone: storeData.phone,
      location: storeData.store.location, // Usar la misma ubicación de la tienda
      role: 'admin',
      store: {
        name: storeData.store.name,
        responsibleName: storeData.store.responsibleName,
        phone: storeData.store.phone,
        categories: storeData.store.categories,
        description: storeData.store.description,
        images: storeData.store.images,
        location: storeData.store.location,
        schedule: storeData.store.schedule
      }
    };

    const result = await register(userData);
    
    if (result.success) {
      // Limpiar formulario y cambiar a login
      setStoreData({
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
      setIsLogin(true);
      setIsStore(false);
    } else {
      // Manejar errores específicos del backend
      if (result.error.includes('E11000 duplicate key error')) {
        setErrors(prev => ({ ...prev, adminEmail: 'Este email ya está registrado' }));
      } else {
        setGeneralError(result.error || 'Error al registrar administrador');
      }
    }
  };

  const handleSubmit = () => {
    if (isLogin) {
      handleLogin();
    } else {
      if (isStore) {
        handleStoreRegister();
      } else {
        handleClientRegister();
      }
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

      {/* Mensaje de error general */}
      {generalError && (
        <div className='bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4'>
          <Text variant='body' size='sm' className='text-red-300'>
            {generalError}
          </Text>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='space-y-6 sm:space-y-8'>
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
                className={`w-full p-4 sm:p-4 border-b-2 bg-transparent outline-none focus:border-b-2 text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base ${
                  errors.email ? 'border-red-400' : 'border-white/50 focus:border-white'
                }`}
                autoComplete='email'
                disabled={isLoading}
              />
              {errors.email && (
                <Text variant='body' size='xs' className='text-red-400 mt-1'>
                  {errors.email}
                </Text>
              )}
            </div>
            <div>
              <label className='block mb-3 sm:mb-3 text-gray-50 text-sm sm:text-base font-medium'>
                Contraseña
              </label>
              <div className='relative'>
                <input
                  type={showClientPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={clientData.password}
                  onChange={(e) => setClientData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full p-4 sm:p-4 pr-12 border-b-2 bg-transparent outline-none focus:border-b-2 text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base ${
                    errors.password ? 'border-red-400' : 'border-white/50 focus:border-white'
                  }`}
                  autoComplete='current-password'
                  disabled={isLoading}
                />
                <button
                  type='button'
                  onClick={() => setShowClientPassword(!showClientPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 rounded'
                  disabled={isLoading}
                  aria-label={showClientPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showClientPassword ? (
                    <EyeOff size={20} className='text-gray-400 hover:text-gray-300' />
                  ) : (
                    <Eye size={20} className='text-gray-400 hover:text-gray-300' />
                  )}
                </button>
              </div>
              {errors.password && (
                <Text variant='body' size='xs' className='text-red-400 mt-1'>
                  {errors.password}
                </Text>
              )}
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
                      disabled={isLoading}
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
                      autoComplete='email'
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      3. Contraseña
                    </label>
                    <div className='relative'>
                      <input
                        type={showStorePassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        value={storeData.password}
                        onChange={(e) => setStoreData(prev => ({ ...prev, password: e.target.value }))}
                        className='w-full p-3 pr-12 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                        autoComplete='new-password'
                        disabled={isLoading}
                      />
                      <button
                        type='button'
                        onClick={() => setShowStorePassword(!showStorePassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 rounded'
                        disabled={isLoading}
                        aria-label={showStorePassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showStorePassword ? (
                          <EyeOff size={18} className='text-gray-400 hover:text-gray-300' />
                        ) : (
                          <Eye size={18} className='text-gray-400 hover:text-gray-300' />
                        )}
                      </button>
                    </div>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      9. Imágenes de la tienda
                    </label>
                    <textarea
                      placeholder='https://i.ibb.co/abc123/imagen-tienda.jpg'
                      value={storeData.store.images.join(', ')}
                      onChange={(e) => {
                        const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url.length > 0);
                        setStoreData(prev => ({ 
                          ...prev, 
                          store: { ...prev.store, images: urls }
                        }));
                      }}
                      rows='3'
                      className='w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base'
                      disabled={isLoading}
                    />
                    <div className='mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300/90'>
                      <p className='font-medium text-blue-300'>📸 Instrucciones para subir imágenes:</p>
                      <div className='space-y-1 mt-1'>
                        <p>1. Ve a <a href="https://es.imgbb.com/" target="_blank" rel="noopener noreferrer" className='text-orange-400 hover:text-orange-300 underline'>ImgBB.com</a></p>
                        <p>2. Sube la imagen de tu tienda (arrastra y suelta)</p>
                        <p>3. Haz clic derecho en la imagen subida</p>
                        <p>4. Selecciona "Abrir imagen en nueva pestaña"</p>
                        <p>5. Copia la URL de la nueva pestaña</p>
                        <p>6. Pega la URL aquí</p>
                        <p className='text-orange-400 font-medium'>• Ejemplo: https://i.ibb.co/abc123/imagen-tienda.jpg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className='block mb-2 text-gray-50 text-sm font-medium'>
                      10. Ubicación exacta de la tienda
                    </label>
                    <div className='mb-3'>
                      <button
                        type='button'
                        onClick={() => window.open('https://www.google.com/maps', '_blank')}
                        className='flex items-center gap-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-300 hover:text-orange-200 transition-colors text-xs'
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className='block mb-3 text-gray-50 text-sm font-medium'>
                      11. Categorías de productos
                      <span className='text-gray-400 text-xs ml-2'>(Selecciona las que apliquen)</span>
                    </label>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                      {[
                        { id: 'tecnologia', label: 'tecnologia', icon: '💻' },
                        { id: 'moda', label: 'moda', icon: '👕' },
                        { id: 'juguetes', label: 'juguetes', icon: '🧸' },
                        { id: 'comida', label: 'comida', icon: '🍔' },
                        { id: 'hogar', label: 'hogar', icon: '🏠' },
                        { id: 'jardin', label: 'jardin', icon: '🌱' },
                        { id: 'mascotas', label: 'mascotas', icon: '🐕' },
                        { id: 'deportes', label: 'deportes', icon: '⚽' },
                        { id: 'belleza', label: 'belleza', icon: '💄' },
                        { id: 'libros', label: 'libros', icon: '📚' },
                        { id: 'musica', label: 'musica', icon: '🎵' },
                        { id: 'arte', label: 'arte', icon: '🎨' },
                        { id: 'automotriz', label: 'automotriz', icon: '🚗' },
                        { id: 'ferreteria', label: 'ferreteria', icon: '🔧' },
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
                            disabled={isLoading}
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
                      12. Horarios de la tienda
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                              disabled={isLoading}
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
                                  disabled={isLoading}
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
                                  disabled={isLoading}
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
                    disabled={isLoading}
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
                    autoComplete='email'
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className='block mb-2 text-gray-50 text-sm font-medium'>
                    3. Contraseña
                  </label>
                  <div className='relative'>
                    <input
                      type={showClientPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      value={clientData.password}
                      onChange={(e) => setClientData(prev => ({ ...prev, password: e.target.value }))}
                      className='w-full p-3 pr-12 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                      autoComplete='new-password'
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      onClick={() => setShowClientPassword(!showClientPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 rounded'
                      disabled={isLoading}
                      aria-label={showClientPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showClientPassword ? (
                        <EyeOff size={18} className='text-gray-400 hover:text-gray-300' />
                      ) : (
                        <Eye size={18} className='text-gray-400 hover:text-gray-300' />
                      )}
                    </button>
                  </div>
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
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                {isLogin ? 'Iniciando Sesión...' : 'Creando Cuenta...'}
              </div>
            ) : (
              isLogin
                ? 'Iniciar Sesión'
                : isStore
                  ? 'Crear Cuenta'
                  : 'Crear Cuenta'
            )}
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
                disabled={isLoading}
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
              onClick={() => toggleStoreForm()}
              disabled={isLoading}
            >
              ¿Eres una tienda? Crear cuenta como tienda
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
