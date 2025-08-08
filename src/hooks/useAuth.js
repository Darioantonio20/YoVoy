import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, API_CONFIG } from '../config/api';
import Alert from '../components/atoms/Alert';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const userRole = localStorage.getItem('userRole');

      if (token && userData && userRole) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Función de login
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        const { token, user } = response.data;
        
        // Guardar datos en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userData', JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        Alert.success('¡Bienvenido!', 'Has iniciado sesión correctamente');
        
        // Redirigir según el rol
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/store');
        }

        return { success: true };
      } else {
        const errorMessage = response.data?.error || response.data?.message || 'Credenciales incorrectas';
        Alert.error('Error de Login', errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Función de registro
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
        const { token, user } = response.data;
        
        // Guardar datos en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userData', JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        const message = user.role === 'admin' 
          ? '¡Tienda Creada! Tu cuenta de administrador y tienda han sido creadas exitosamente'
          : '¡Cuenta Creada! Tu cuenta de cliente ha sido creada exitosamente';
        
        Alert.success('¡Éxito!', message);
        
        // Redirigir según el rol
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/store');
        }

        return { success: true };
      } else {
        const errorMessage = response.data?.error || response.data?.message || 'No se pudo crear la cuenta';
        Alert.error('Error de Registro', errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Función de logout
  const logout = useCallback(() => {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');

    // Limpiar estado
    setUser(null);
    setIsAuthenticated(false);

    // Redirigir a home
    navigate('/');

    Alert.success('Sesión Cerrada', 'Has cerrado sesión exitosamente');
  }, [navigate]);

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Función para verificar si es admin
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Función para verificar si es cliente
  const isClient = useCallback(() => {
    return hasRole('client');
  }, [hasRole]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isClient,
  };
}; 