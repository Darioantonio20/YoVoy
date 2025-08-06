import { useState, useCallback } from 'react';
import { apiRequest, API_CONFIG, getAuthHeaders } from '../config/api';
import Alert from '../components/atoms/Alert';

export const useMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    perPage: 10
  });

  // Obtener mis pedidos
  const getMyOrders = useCallback(async (status = null, page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (page) params.append('page', page);

      const endpoint = `${API_CONFIG.ENDPOINTS.ORDERS.GET_MY_ORDERS}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiRequest(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        setOrders(response.data.data.orders);
        setPagination(response.data.data.pagination);
        return response.data.data;
      } else {
        setError(response.data?.message || 'Error al cargar los pedidos');
        Alert.error('Error', response.data?.message || 'No se pudieron cargar los pedidos');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError('Error de conexión al cargar los pedidos');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener detalle de un pedido específico
  const getMyOrder = useCallback(async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = API_CONFIG.ENDPOINTS.ORDERS.GET_MY_ORDER.replace(':id', orderId);
      const response = await apiRequest(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.success) {
        setSelectedOrder(response.data.data.order);
        return response.data.data.order;
      } else {
        setError(response.data?.message || 'Error al cargar el detalle del pedido');
        Alert.error('Error', response.data?.message || 'No se pudo cargar el detalle del pedido');
        return null;
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      setError('Error de conexión al cargar el detalle del pedido');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpiar pedido seleccionado
  const clearSelectedOrder = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  // Limpiar todos los datos
  const clearOrders = useCallback(() => {
    setOrders([]);
    setSelectedOrder(null);
    setError(null);
    setPagination({
      page: 1,
      total: 0,
      perPage: 10
    });
  }, []);

  return {
    orders,
    selectedOrder,
    isLoading,
    error,
    pagination,
    getMyOrders,
    getMyOrder,
    clearSelectedOrder,
    clearOrders,
  };
}; 