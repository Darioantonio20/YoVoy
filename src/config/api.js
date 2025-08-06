// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api-jasai-production.up.railway.app',
  ENDPOINTS: {
    // 🔐 AUTENTICACIÓN
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      UPDATE_PROFILE: '/api/auth/update-profile',
      GET_PROFILE: '/api/auth/me',
      CHANGE_PASSWORD: '/api/auth/change-password',
      // Gestión de ubicaciones
      LOCATIONS: {
        ADD: '/api/auth/locations',
        UPDATE: '/api/auth/locations/:id',
        DELETE: '/api/auth/locations/:id',
        SET_CURRENT: '/api/auth/locations/:id/set-current',
        GET_CURRENT: '/api/auth/locations/current',
      },
    },

    // 🏪 TIENDAS (Públicas y Admin)
    STORES: {
      LIST: '/api/stores',
      DETAIL: '/api/stores/:storeId',
      // Admin endpoints
      OWNER: '/api/stores/owner/:ownerId',
      UPDATE: '/api/stores/:storeId',
      // Productos de tienda
      PRODUCTS: {
        LIST: '/api/stores/:storeId/products',
        DETAIL: '/api/stores/:storeId/products/:productId',
        CREATE: '/api/stores/:storeId/products',
        UPDATE: '/api/stores/:storeId/products/:productId',
        DELETE: '/api/stores/:storeId/products/:productId',
      },
    },

    // 🛒 CARRITO (Sin autenticación)
    CART: {
      GET: '/api/cart',
      ADD: '/api/cart/add',
      UPDATE: '/api/cart/update',
      REMOVE: '/api/cart/remove',
      CLEAR: '/api/cart/clear',
    },

    // 📋 PEDIDOS
    ORDERS: {
      CREATE: '/api/orders/create',
      // Cliente endpoints
      GET_MY_ORDERS: '/api/orders/my-orders',
      GET_MY_ORDER: '/api/orders/my-orders/:id',
      // Admin endpoints
      ADMIN: {
        LIST: '/api/orders/admin/orders',
        DETAIL: '/api/orders/admin/orders/:id',
        UPDATE_STATUS: '/api/orders/admin/orders/:id/status',
        STATS: '/api/orders/admin/stats',
      },
    },
  },
};

// Función para obtener el token de autenticación
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Función para obtener headers con autenticación
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Función para obtener session ID del carrito
export const getSessionId = () => {
  return localStorage.getItem('sessionId') || sessionStorage.getItem('sessionId');
};

// Función helper para construir URLs con parámetros
export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach(key => {
    const placeholder = `:${key}`;
    const value = params[key];
    url = url.replace(placeholder, value);
  });
  return url;
};

// Función para generar session ID
export const generateSessionId = () => {
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('sessionId', sessionId);
  return sessionId;
};

// Función para obtener headers del carrito (con session ID)
export const getCartHeaders = () => {
  const sessionId = getSessionId() || generateSessionId();
  return {
    'Content-Type': 'application/json',
    'x-session-id': sessionId,
  };
};

// Función para hacer peticiones HTTP
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Verificar si la respuesta es JSON válido
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Si no es JSON, crear un objeto de error
      const text = await response.text();
      data = { 
        success: false, 
        message: text || `Error ${response.status}: ${response.statusText}` 
      };
    }
    
    return {
      success: response.ok && data.success,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      data: { message: 'Error de conexión' },
      status: 0,
    };
  }
}; 