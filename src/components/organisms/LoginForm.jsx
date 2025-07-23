import { memo } from "react";
import { Link } from "react-router-dom";
import Button from "../atoms/Button";

const LoginForm = memo(() => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔐</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h1>
        <p className="text-gray-600">Inicia sesión o regístrate para continuar</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            className="input-field"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input 
            type="password" 
            className="input-field"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Link to="/store" className="block">
          <Button className="w-full">
            🔑 Iniciar Sesión
          </Button>
        </Link>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o</span>
          </div>
        </div>

        <Button variant="secondary" className="w-full">
          📝 Crear Cuenta
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Al continuar, aceptas nuestros términos y condiciones
      </p>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm; 