import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
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
      <div className={`${isLogin ? 'max-w-[900px]' : 'max-w-[800px]'} w-full mx-auto bg-[#0d1b2a] rounded-lg shadow-2xl p-4 sm:p-8 md:p-10 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}>
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
              <div className="text-center mb-4 sm:mb-6 opacity-70">
          {isLogin && (
            <div className="w-16 h-16 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 border border-white/20">
              <User size={24} className="sm:w-6 sm:h-6 text-white" />
            </div>
          )}
          <Text variant="h2" size="xl" className="sm:text-2xl text-gray-50 mb-2 sm:mb-3">
            {isLogin ? "Bienvenido" : "Crear Cuenta"}
          </Text>
        </div>

      <div className="space-y-6 sm:space-y-8">
        {isLogin ? (
          // Formulario de Login
          <>
            <div>
              <label className="block mb-3 sm:mb-3 text-gray-50 text-sm sm:text-base font-medium">
                Email
              </label>
              <input 
                type="email" 
                placeholder="tu@email.com"
                className="w-full p-4 sm:p-4 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block mb-3 sm:mb-3 text-gray-50 text-sm sm:text-base font-medium">
                Contraseña
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 sm:p-4 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
              />
            </div>
          </>
        ) : (
          // Formulario de Registro
          <>      
            {isStore ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Fila 1 */}
                <div>
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    1. Nombre completo
                  </label>
                  <input 
                    type="text" 
                    placeholder="Nombre del responsable"
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    2. Contraseña
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                {/* Fila 2 alineada */}
                <div className="flex flex-col h-full">
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    3. Número telefónico
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Teléfono de contacto"
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <label className="block mb-5 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    4. Ubicación de la tienda
                  </label>
                  <textarea 
                    placeholder="Dirección"
                    rows="2"
                    className="w-full  border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base"
                  />
                </div>
                {/* Fila 3: Categoría */}
                <div className="md:col-span-2">
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    5. Categoría de productos
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: comida, moda, juguetes, etc."
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Fila 1 */}
                <div>
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    1. Nombre completo
                  </label>
                  <input 
                    type="text" 
                    placeholder="Tu nombre completo"
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    2. Contraseña
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                {/* Fila 2 alineada */}
                <div className="flex flex-col h-full">
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    3. Número telefónico
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <label className="block mb-2 sm:mb-2 text-gray-50 text-sm sm:text-sm font-medium">
                    4. Ubicación para envío
                  </label>
                  <textarea 
                    placeholder="Dirección"
                    rows="1"
                    className="w-full p-3 sm:p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="space-y-5 sm:space-y-5">
          <Button 
            variant="fire" 
            className="w-full p-4 sm:p-4 text-sm sm:text-base"
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
                className="w-full p-4 sm:p-4 border-white/50 text-white hover:bg-white hover:text-gray-700 text-sm sm:text-base"
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
              className="block w-full text-sm text-orange-400 mt-2 sm:mt-2 hover:underline text-center"
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