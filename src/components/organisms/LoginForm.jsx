import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const LoginForm = memo(({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isStore, setIsStore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [storeLocation, setStoreLocation] = useState({ alias: '', link: '' });
  const [clientLocation, setClientLocation] = useState({ alias: '', link: '' });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = () => {
    // Validar campos requeridos
    if (!isLogin) {
      if (isStore) {
        // Validar campos de tienda
        if (!storeLocation.alias.trim() || !storeLocation.link.trim()) {
          alert('Por favor, completa el nombre y el vínculo de la ubicación de la tienda');
          return;
        }
        if (selectedCategories.length === 0) {
          alert('Por favor, selecciona al menos una categoría');
          return;
        }
        navigate('/admin');
      } else {
        // Validar campos de cliente
        if (!clientLocation.alias.trim() || !clientLocation.link.trim()) {
          alert('Por favor, completa el nombre y el vínculo de tu ubicación de entrega');
          return;
        }
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
                className='w-full p-4 sm:p-4 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
              />
            </div>
          </>
        ) : (
          // Formulario de Registro
          <>
            {isStore ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                {/* Fila 1 */}
                <div>
                  <label className='block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    1. Nombre completo
                  </label>
                  <input
                    type='text'
                    placeholder='Nombre del responsable'
                    className='w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div>
                  <label className='block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    2. Contraseña
                  </label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    className='w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                {/* Fila 2 alineada */}
                <div className='flex flex-col h-full'>
                  <label className='block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    3. Número telefónico
                  </label>
                  <input
                    type='tel'
                    placeholder='Teléfono de contacto'
                    className='w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div className='flex flex-col h-full'>
                  <label className='block mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    4. Ubicación exacta de la tienda
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
                        <p>2. Busaca el icono de compartir</p>
                        <p>3. Dale clic en copiar vínculo</p>
                        <p>4. Pégala pegala en el campo requerido</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={storeLocation.alias}
                      onChange={(e) => setStoreLocation(prev => ({ ...prev, alias: e.target.value }))}
                      placeholder="Nombre de la tienda (ej: Sucursal Centro, Local Principal)"
                      className='w-full border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                    <textarea
                      value={storeLocation.link}
                      onChange={(e) => setStoreLocation(prev => ({ ...prev, link: e.target.value }))}
                      placeholder='Pega aquí el vínculo de Google Maps'
                      rows='2'
                      className='w-full border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base'
                    />
                  </div>
                </div>
                {/* Fila 3: Categoría */}
                <div className='md:col-span-2'>
                  <label className='block mb-3 text-gray-50 text-sm sm:text-sm font-medium'>
                    5. Categorías de productos
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
                          checked={selectedCategories.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== category.id));
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
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                {/* Fila 1 */}
                <div>
                  <label className='block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    1. Nombre completo
                  </label>
                  <input
                    type='text'
                    placeholder='Tu nombre completo'
                    className='w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div>
                  <label className='block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    2. Contraseña
                  </label>
                  <input
                    type='password'
                    placeholder='••••••••'
                    className='w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                {/* Fila 2 alineada */}
                <div className='flex flex-col h-full'>
                  <label className='block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    3. Número telefónico
                  </label>
                  <input
                    type='tel'
                    placeholder='+1 (555) 123-4567'
                    className='w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                  />
                </div>
                <div className='flex flex-col h-full'>
                  <label className='block mb-2 text-gray-50 text-sm sm:text-sm font-medium'>
                    4. Ubicación para envío
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
                      value={clientLocation.alias}
                      onChange={(e) => setClientLocation(prev => ({ ...prev, alias: e.target.value }))}
                      placeholder="Nombre del lugar (ej: Casa, Trabajo, Gimnasio)"
                      className='w-full border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base'
                    />
                    <textarea
                      value={clientLocation.link}
                      onChange={(e) => setClientLocation(prev => ({ ...prev, link: e.target.value }))}
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
