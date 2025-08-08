import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import Alert from '../components/atoms/Alert';

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [previousItemCount, setPreviousItemCount] = useState(0);
  const [originalProducts, setOriginalProducts] = useState({}); // Para mantener referencia a productos originales
  
  // Usar el hook useCart que maneja la API
  const {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart: apiAddToCart,
    updateCartItem: apiUpdateCartItem,
    removeFromCart: apiRemoveFromCart,
    clearCart: apiClearCart,
    calculateTotals,
    getItemQuantity,
    isCartEmpty,
  } = useCart();

  // Cargar carrito cuando cambie la tienda
  useEffect(() => {
    if (currentStoreId) {
      fetchCart(currentStoreId);
    }
  }, [currentStoreId, fetchCart]);

  // Actualizar previousItemCount cuando cambie el carrito
  useEffect(() => {
    const currentItemCount = cart.totalItems || 0;
    if (currentItemCount !== previousItemCount) {
      setPreviousItemCount(currentItemCount);
    }
  }, [cart.totalItems, previousItemCount]);

  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1, note = '') => {
    if (!currentStoreId) {
      Alert.error('Error', 'No se pudo identificar la tienda');
      return false;
    }

    try {
      const productData = {
        productId: product._id,
        quantity,
        note,
        storeId: currentStoreId
      };

      const result = await apiAddToCart(productData);
      
      if (result) {
        // Guardar referencia al producto original para poder mostrar adminNote
        setOriginalProducts(prev => ({
          ...prev,
          [product._id]: product
        }));
        
        Alert.success('¡Agregado!', 'Producto agregado al carrito');
        return true;
      } else {
        Alert.error('Error', error || 'No se pudo agregar al carrito');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.error('Error', 'Error al agregar al carrito');
      return false;
    }
  };

  // Remover producto del carrito
  const removeFromCart = async (productId) => {
    if (!currentStoreId) {
      Alert.error('Error', 'No se pudo identificar la tienda');
      return false;
    }

    try {
      const result = await apiRemoveFromCart(productId, currentStoreId);
      
      if (result) {
        Alert.success('¡Eliminado!', 'Producto removido del carrito');
        return true;
      } else {
        Alert.error('Error', error || 'No se pudo remover del carrito');
        return false;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.error('Error', 'Error al remover del carrito');
      return false;
    }
  };

  // Actualizar cantidad de un producto
  const updateQuantity = async (productId, quantity) => {
    if (!currentStoreId) {
      Alert.error('Error', 'No se pudo identificar la tienda');
      return false;
    }

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      const productData = {
        productId,
        quantity,
        storeId: currentStoreId
      };

      const result = await apiUpdateCartItem(productData);
      
      if (result) {
        return true;
      } else {
        Alert.error('Error', error || 'No se pudo actualizar la cantidad');
        return false;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.error('Error', 'Error al actualizar cantidad');
      return false;
    }
  };

  // Actualizar nota de un producto
  const updateNote = async (productId, note) => {
    if (!currentStoreId) {
      Alert.error('Error', 'No se pudo identificar la tienda');
      return false;
    }

    try {
      const productData = {
        productId,
        note,
        storeId: currentStoreId
      };

      const result = await apiUpdateCartItem(productData);
      
      if (result) {
        return true;
      } else {
        Alert.error('Error', error || 'No se pudo actualizar la nota');
        return false;
      }
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.error('Error', 'Error al actualizar nota');
      return false;
    }
  };

  // Limpiar carrito
  const clearCart = async (showAlert = true) => {
    if (!currentStoreId) {
      Alert.error('Error', 'No se pudo identificar la tienda');
      return false;
    }

    try {
      const result = await apiClearCart(currentStoreId);
      
      if (result) {
        // Solo mostrar alerta si se solicita explícitamente
        if (showAlert) {
          Alert.success('¡Carrito vaciado!', 'El carrito se ha vaciado correctamente');
        }
        return true;
      } else {
        Alert.error('Error', error || 'No se pudo vaciar el carrito');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.error('Error', 'Error al vaciar el carrito');
      return false;
    }
  };

  // Calcular total de productos
  const getTotalItems = () => {
    return cart.totalItems || 0;
  };

  // Calcular subtotal
  const getSubtotal = () => {
    return cart.subtotal || 0;
  };

  // Establecer tienda actual
  const setStore = (storeId) => {
    setCurrentStoreId(storeId);
  };

  // Obtener cantidad de un producto específico
  const getItemQuantityFromCart = (productId) => {
    return getItemQuantity(productId);
  };

  // Función para obtener items del carrito con información completa
  const getCartItemsWithNotes = () => {
    const items = cart.items || [];
    const itemsWithNotes = items.map(item => {
      const originalProduct = originalProducts[item.productId];
      const itemWithNotes = {
        ...item,
        // Incluir adminNote del producto original si existe
        adminNote: originalProduct?.adminNote || item.adminNote,
        // Asegurar que la nota del cliente esté presente
        note: item.note || ''
      };
      

      
      return itemWithNotes;
    });
    
    return itemsWithNotes;
  };

  const value = {
    cartItems: getCartItemsWithNotes(),
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNote,
    clearCart,
    getTotalItems,
    getSubtotal,
    isLoading,
    error,
    setStore,
    currentStoreId,
    previousItemCount,
    isCartEmpty: isCartEmpty(),
    getItemQuantity: getItemQuantityFromCart,
    originalProducts, // Exponer productos originales
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
