import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_CONFIG, getCartHeaders } from '../config/api';

export const useCart = () => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener carrito actual
  const fetchCart = useCallback(async (storeId) => {
    if (!storeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `${API_CONFIG.ENDPOINTS.CART.GET}?storeId=${storeId}`;
      const response = await apiRequest(endpoint, {
        method: 'GET',
        headers: getCartHeaders(),
      });

      if (response.success) {

        
        setCart(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || 'Error al cargar el carrito');
        return null;
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Error de conexión al cargar el carrito');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar producto al carrito
  const addToCart = useCallback(async (productData) => {
    setIsLoading(true);
    setError(null);

    try {

      
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CART.ADD, {
        method: 'POST',
        headers: getCartHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.success) {

        
        setCart(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || 'Error al agregar producto al carrito');
        return null;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Error de conexión al agregar al carrito');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar producto en el carrito
  const updateCartItem = useCallback(async (productData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CART.UPDATE, {
        method: 'PUT',
        headers: getCartHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.success) {
        setCart(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || 'Error al actualizar producto en el carrito');
        return null;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError('Error de conexión al actualizar el carrito');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remover producto del carrito
  const removeFromCart = useCallback(async (productId, storeId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CART.REMOVE, {
        method: 'DELETE',
        headers: getCartHeaders(),
        body: JSON.stringify({
          productId,
          storeId
        }),
      });

      if (response.success) {
        setCart(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || 'Error al remover producto del carrito');
        return null;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Error de conexión al remover del carrito');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Vaciar carrito
  const clearCart = useCallback(async (storeId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CART.CLEAR, {
        method: 'DELETE',
        headers: getCartHeaders(),
        body: JSON.stringify({ storeId }),
      });

      if (response.success) {
        setCart({
          items: [],
          totalItems: 0,
          subtotal: 0
        });
        return true;
      } else {
        setError(response.data.message || 'Error al vaciar el carrito');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Error de conexión al vaciar el carrito');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calcular totales
  const calculateTotals = useCallback(() => {
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return {
      subtotal,
      total: subtotal // Aquí se puede agregar delivery fee si es necesario
    };
  }, [cart.items]);

  // Obtener cantidad de un producto específico
  const getItemQuantity = useCallback((productId) => {
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }, [cart.items]);

  // Verificar si el carrito está vacío
  const isCartEmpty = useCallback(() => {
    return cart.items.length === 0;
  }, [cart.items]);

  return {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    calculateTotals,
    getItemQuantity,
    isCartEmpty,
  };
};
