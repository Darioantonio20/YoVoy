import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, User, Mail, Lock, Phone, MapPin, ArrowLeft } from "lucide-react";
import Button from "../atoms/Button";
import Text from "../atoms/Text";

const LoginForm = memo(({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = () => {
    // Aquí iría la lógica de autenticación
    navigate('/store');
  };

  return (
    <div className={`${isLogin ? 'max-w-[400px]' : 'max-w-[600px]'} w-full mx-auto bg-[#0d1b2a] rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto`}>
      {/* Botón de back */}
      {onBack && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Volver"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      )}
      <div className="text-center mb-8 opacity-70">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 ">
          {isLogin ? <LogIn size={28} className="text-white" /> : <User size={28} className="text-white" />}
        </div>
        <Text variant="h2" size="2xl" className="text-gray-50 mb-2">
          {isLogin ? "Bienvenido" : "Crear Cuenta"}
        </Text>
        <Text variant="bodyLight" size="sm" className="text-gray-400">
          {isLogin 
            ? "Inicia sesión o regístrate para continuar"
            : "Completa tus datos para crear tu cuenta"
          }
        </Text>
      </div>

      <div className="space-y-6">
        {isLogin ? (
          // Formulario de Login
          <>
            <div>
              <label className="block mb-2 text-gray-50 text-sm font-medium flex items-center gap-2">
                <Mail size={16} className="text-white" />
                Email
              </label>
              <input 
                type="email" 
                placeholder="tu@email.com"
                className="w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-50 text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="text-white" />
                Contraseña
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors"
              />
            </div>
          </>
        ) : (
          // Formulario de Registro
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fila 1 */}
            <div>
              <label className="block mb-2 text-gray-50 text-sm font-medium flex items-center gap-2">
                <User size={16} className="text-white" />
                1. Nombre completo
              </label>
              <input 
                type="text" 
                placeholder="Tu nombre completo"
                className="w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-50 text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="text-white" />
                2. Contraseña
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors"
              />
            </div>
            {/* Fila 2 alineada */}
            <div className="flex flex-col h-full">
              <label className="block mb-2 text-gray-50 text-sm font-medium flex items-center gap-2">
                <Phone size={16} className="text-white" />
                3. Número telefónico
              </label>
              <input 
                type="tel" 
                placeholder="+1 (555) 123-4567"
                className="w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors min-h-[72px] md:min-h-[98px]"
              />
            </div>
            <div className="flex flex-col h-full">
              <label className="block mb-2 text-gray-50 text-sm font-medium flex items-center gap-2">
                <MapPin size={16} className="text-white" />
                4. Ubicación para envío
              </label>
              <textarea 
                placeholder="Dirección completa para envío"
                rows="3"
                className="w-full p-3 border-b-2 border-white/50 bg-transparent outline-none focus:border-b-2 focus:border-white text-gray-50 placeholder-gray-500 transition-colors resize-none min-h-[72px] md:min-h-[72px]"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button 
            variant="fire" 
            className="w-full p-3"
            onClick={handleSubmit}
          >
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0d1b2a] text-gray-400">o</span>
            </div>
          </div>

          <Button
            variant="minimal"
            className="w-full p-3 border-white/50 text-white hover:bg-white hover:text-gray-700"
            onClick={toggleForm}
          >
            {isLogin ? "Crear Cuenta" : "Ya tengo cuenta"}
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        Al continuar, aceptas nuestros términos y condiciones
      </p>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm; 