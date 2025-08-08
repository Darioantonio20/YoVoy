import { useState, useCallback } from 'react';
import { apiRequest, API_CONFIG, getAuthHeaders, buildUrl } from '../config/api';
import Alert from '../components/atoms/Alert';

export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== GESTIÓN DE TIENDA =====

  // Obtener tienda del admin
  const getMyStore = useCallback(async (ownerId) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.OWNER, { ownerId });
      const response = await apiRequest(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        return response.data.data;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al cargar la tienda');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudo cargar la tienda');
        return null;
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      setError('Error de conexión al cargar la tienda');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar tienda
  const updateStore = useCallback(async (storeId, storeData) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.UPDATE, { storeId });
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData),
      });

      if (response.success) {
        Alert.success('Tienda Actualizada', 'La información de la tienda se ha actualizado correctamente');
        return response.data.data;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al actualizar la tienda');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudo actualizar la tienda');
        return null;
      }
    } catch (error) {
      console.error('Error updating store:', error);
      setError('Error de conexión al actualizar la tienda');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== GESTIÓN DE PRODUCTOS =====

  // Obtener productos de la tienda
  const getMyProducts = useCallback(async (storeId, filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.PRODUCTS.LIST, { storeId });
      const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiRequest(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        return response.data;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al cargar los productos');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudieron cargar los productos');
        return null;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error de conexión al cargar los productos');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear producto
  const createProduct = useCallback(async (storeId, productData) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.PRODUCTS.CREATE, { storeId });
      const response = await apiRequest(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.success) {
        Alert.success('Producto Creado', 'El producto se ha creado correctamente');
        return response.data.data;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al crear el producto');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudo crear el producto');
        return null;
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Error de conexión al crear el producto');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar producto
  const updateProduct = useCallback(async (storeId, productId, productData) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.PRODUCTS.UPDATE, { storeId, productId });
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.success) {
        Alert.success('Producto Actualizado', 'El producto se ha actualizado correctamente');
        return response.data.data;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al actualizar el producto');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudo actualizar el producto');
        return null;
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error de conexión al actualizar el producto');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Eliminar producto
  const deleteProduct = useCallback(async (storeId, productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.PRODUCTS.DELETE, { storeId, productId });
      const response = await apiRequest(endpoint, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        Alert.success('Producto Eliminado', 'El producto se ha eliminado correctamente');
        return true;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al eliminar el producto');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudo eliminar el producto');
        return false;
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error de conexión al eliminar el producto');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== GESTIÓN DE PEDIDOS =====

  // Obtener todos los pedidos (admin)
  const getAdminOrders = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.date) params.append('date', filters.date);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const endpoint = `${API_CONFIG.ENDPOINTS.ORDERS.ADMIN.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiRequest(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        return response.data.data;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al cargar los pedidos');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudieron cargar los pedidos');
        return null;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error de conexión al cargar los pedidos');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener pedido específico (admin)
  const getAdminOrder = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.ORDERS.ADMIN.DETAIL, { id: orderId });
      const response = await apiRequest(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        return response.data.data.order;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al cargar el pedido');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudo cargar el pedido');
        return null;
      }
    } catch (error) {
      setError('Error de conexión al cargar el pedido');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar estado del pedido (admin)
  const updateOrderStatus = useCallback(async (orderId, status, notes = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.ORDERS.ADMIN.UPDATE_STATUS, { id: orderId });
      const requestBody = { 
        status: status,
        notes: notes || ''
      };
      
      const response = await apiRequest(endpoint, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (response.success) {
        Alert.success('Estado Actualizado', 'El estado del pedido se ha actualizado correctamente');
        return response.data.data.order;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al actualizar el estado');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudo actualizar el estado del pedido');
        return null;
      }
    } catch (error) {
      setError('Error de conexión al actualizar el estado');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== ESTADÍSTICAS =====

  // Obtener estadísticas del admin
  const getAdminStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.ORDERS.ADMIN.STATS, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        return response.data.data;
      } else {
        setError(response.data?.error || response.data?.message || 'Error al cargar las estadísticas');
        Alert.error('Error', response.data?.error || response.data?.message || 'No se pudieron cargar las estadísticas');
        return null;
      }
    } catch (error) {
      setError('Error de conexión al cargar las estadísticas');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    // Gestión de tienda
    getMyStore,
    updateStore,
    // Gestión de productos
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // Gestión de pedidos (admin)
    getAdminOrders,
    getAdminOrder,
    updateOrderStatus,
    // Estadísticas (admin)
    getAdminStats,
  };
}; 