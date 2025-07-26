import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Mail, Lock, Phone, MapPin, ArrowLeft, Boxes } from "lucide-react";
import Button from "../atoms/Button";
import Text from "../atoms/Text";

const LoginForm = memo(({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isStore, setIsStore] = useState(false); // Nuevo estado para "crear cuenta como tienda"
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = () => {
    // Aquí iría la lógica de autenticación o registro
    if (!isLogin && isStore) {
      navigate('/admin'); // Redirige al panel administrativo si es tienda
    } else {
      navigate('/store');
    }
  };

  return (
    <div className={`${isLogin ? 'max-w-[400px]' : 'max-w-[600px]'} w-full mx-auto bg-[#0d1b2a] rounded-lg shadow-2xl p-3 sm:p-6 md:p-8 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}>
      {/* Botón de back */}
      {onBack && (
        <div className="mb-2 sm:mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Volver"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      )}
      <div className="text-center mb-3 sm:mb-8 opacity-70">
        <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-4 border border-white/20">
          {isLogin ? <LogIn size={16} className="sm:w-7 sm:h-7 text-white" /> : <User size={16} className="sm:w-7 sm:h-7 text-white" />}
        </div>
        <Text variant="h2" size="lg" className="sm:text-2xl text-gray-50 mb-1 sm:mb-2">
          {isLogin ? "Bienvenido" : "Crear Cuenta"}
        </Text>
        <Text variant="bodyLight" size="xs" className="sm:text-sm text-gray-400">
          {isLogin 
            ? "Inicia sesión para continuar"
            : "Completa tus datos para crear tu cuenta"
          }
        </Text>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {isLogin ? (
          // Formulario de Login
          <>
            <div>
              <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <Mail size={16} className="sm:w-4 sm:h-4 text-white" />
                Email
              </label>
              <input 
                type="email" 
                placeholder="tu@email.com"
                className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <Lock size={16} className="sm:w-4 sm:h-4 text-white" />
                Contraseña
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
              />
            </div>
          </>
        ) : (
          // Formulario de Registro
          <>
            {/* Botón para volver a cuenta personal, solo en registro de tienda */}
            {!isLogin && isStore && (
              <button
                type="button"
                className="block w-full text-xs text-gray-300 mt-1 sm:mt-2 hover:underline text-center"
                onClick={() => setIsStore(false)}
              >
                ¿No eres una tienda? Crear cuenta personal
              </button>
            )}
            {isStore ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {/* Fila 1 */}
                <div>
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <User size={14} className="sm:w-4 sm:h-4 text-white" />
                    1. Nombre completo
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nombre del responsable"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <Lock size={14} className="sm:w-4 sm:h-4 text-white" />
                    2. Contraseña
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                {/* Fila 2 alineada */}
                <div className="flex flex-col h-full">
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <Phone size={14} className="sm:w-4 sm:h-4 text-white" />
                    3. Número telefónico
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Teléfono de contacto"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <MapPin size={14} className="sm:w-4 sm:h-4 text-white" />
                    4. Ubicación de la tienda
                  </label>
                  <textarea 
                    placeholder="Dirección"
                    rows="1"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base"
                  />
                </div>
                {/* Fila 3: Categoría */}
                <div className="md:col-span-2">
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <Boxes size={14} className="sm:w-4 sm:h-4 text-white" />
                    5. Categoría de productos
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: comida, moda, juguetes, etc."
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {/* Fila 1 */}
                <div>
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <User size={14} className="sm:w-4 sm:h-4 text-white" />
                    1. Nombre completo
                  </label>
                  <input 
                    type="text" 
                    placeholder="Tu nombre completo"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <Lock size={14} className="sm:w-4 sm:h-4 text-white" />
                    2. Contraseña
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                {/* Fila 2 alineada */}
                <div className="flex flex-col h-full">
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <Phone size={14} className="sm:w-4 sm:h-4 text-white" />
                    3. Número telefónico
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <label className="block mb-1 sm:mb-2 text-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <MapPin size={14} className="sm:w-4 sm:h-4 text-white" />
                    4. Ubicación para envío
                  </label>
                  <textarea 
                    placeholder="Dirección"
                    rows="1"
                    className="w-full p-1.5 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="space-y-3 sm:space-y-4">
          <Button 
            variant="fire" 
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base"
            onClick={handleSubmit}
          >
            {isLogin ? "Iniciar Sesión" : isStore ? "Crear Cuenta" : "Crear Cuenta"}
          </Button>
          
          {isLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 sm:px-3 bg-[#0d1b2a] text-gray-400">o</span>
                </div>
              </div>

              <Button
                variant="minimal"
                className="w-full p-2.5 sm:p-3 border-white/50 text-white hover:bg-white hover:text-gray-700 text-sm sm:text-base"
                onClick={toggleForm}
              >
                Crear Cuenta
              </Button>
            </>
          )}
          
          {/* Botón leyenda para crear cuenta como tienda, solo en registro personal */}
          {!isLogin && !isStore && (
            <button
              type="button"
              className="block w-full text-xs text-orange-400 mt-1 sm:mt-2 hover:underline text-center"
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