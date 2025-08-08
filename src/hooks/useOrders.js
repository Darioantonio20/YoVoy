import { useState, useCallback } from 'react';
import { apiRequest, API_CONFIG, getAuthHeaders } from '../config/api';
import Alert from '../components/atoms/Alert';

export const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Crear orden
  const createOrder = useCallback(async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        const errorMessage = response.data?.error || response.data?.message || 'Error al crear la orden';
        setError(errorMessage);
        Alert.error('Error', errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      setError('Error de conexión al crear la orden');
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear orden con datos del usuario autenticado
  const createOrderWithUserData = useCallback(async (orderData, userData) => {
    // Estructura completa según la documentación del backend
    const completeOrderData = {
      customer: {
        name: userData?.name || 'Cliente',
        email: userData?.email || '',
        phone: userData?.phone || '',
        shippingAddress: userData?.locations?.[userData?.currentLocationIndex]?.alias || 'Dirección no especificada'
      },
      items: orderData.items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        note: item.note || '',
        adminNote: item.adminNote || '' // Incluir también la nota del admin
      })),
      payment: {
        method: orderData.paymentMethod || 'efectivo',
        details: orderData.paymentDetails || 'Pago en efectivo al momento de la entrega'
      },
      totals: {
        subtotal: orderData.subtotal,
        shipping: orderData.shipping || 0,
        total: orderData.total
      },
      storeId: orderData.storeId
    };

    const result = await createOrder(completeOrderData);
    return result;
  }, [createOrder]);

  return { 
    isLoading, 
    error, 
    createOrder, 
    createOrderWithUserData 
  };
}; 