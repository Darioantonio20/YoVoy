import React, { createContext, useContext, useState, useEffect } from 'react';

const CART_STORAGE_KEY = 'jasai_cart';

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousItemCount, setPreviousItemCount] = useState(0);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Agregar producto al carrito
  const addToCart = product => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item con nota vacía
        return [...prevItems, { ...product, quantity: 1, note: '' }];
      }
    });
  };

  // Remover producto del carrito
  const removeFromCart = productId => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total de productos
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Actualizar previousItemCount cuando cambie el carrito
  useEffect(() => {
    const currentItemCount = getTotalItems();
    if (currentItemCount !== previousItemCount) {
      setPreviousItemCount(currentItemCount);
    }
  }, [cartItems]);

  // Calcular subtotal
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '').replace(',', ''));
      return total + price * item.quantity;
    }, 0);
  };

  // Actualizar nota de un producto
  const updateNote = (productId, note) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, note } : item
      )
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNote,
    clearCart,
    getTotalItems,
    getSubtotal,
    isInitialized,
    previousItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
