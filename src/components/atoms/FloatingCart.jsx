import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, X, Package } from "lucide-react";

const FloatingCart = ({ itemCount = 0, className = "", previousItemCount = 0 }) => {
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  const location = useLocation();
  const isInStore = location.pathname === '/store';

  // Detectar cuando se añade un producto al carrito
  useEffect(() => {
    if (itemCount > previousItemCount) {
      setIsAnimating(true);
      setShowAddedAnimation(true);
      
      // Resetear animación después de 2 segundos
      setTimeout(() => {
        setIsAnimating(false);
        setShowAddedAnimation(false);
      }, 2000);
    }
  }, [itemCount, previousItemCount]);

  const handleCartClick = (e) => {
    if (itemCount === 0 && isInStore) {
      e.preventDefault();
      setShowEmptyAlert(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowEmptyAlert(false), 3000);
    }
  };

  return (
    <>
      <Link 
        to="/cart" 
        className={`fixed top-6 right-6 z-50 group ${className}`}
        onClick={handleCartClick}
      >
        <div className="relative">
          {/* Icono del carrito con animación */}
          <div className={`
            w-14 h-14 
            bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 
            hover:from-orange-600 hover:via-orange-700 hover:to-red-600 
            rounded-full flex items-center justify-center 
            shadow-lg hover:shadow-xl 
            transition-all duration-300 ease-out
            group-hover:scale-110 group-hover:rotate-3
            ${isAnimating ? 'animate-bounce scale-125' : ''}
            ${showAddedAnimation ? 'ring-4 ring-green-400 ring-opacity-75' : ''}
            backdrop-blur-sm
          `}>
            <ShoppingCart className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          
          {/* Badge con número de productos */}
          {itemCount > 0 && (
            <div className={`
              absolute -top-2 -right-2 
              w-6 h-6 
              bg-gradient-to-br from-red-500 to-red-600
              text-white text-xs font-bold 
              rounded-full flex items-center justify-center 
              shadow-lg
              ${isAnimating ? 'animate-ping scale-150' : 'animate-pulse'}
              transition-all duration-300
            `}>
              {itemCount > 99 ? "99+" : itemCount}
            </div>
          )}
          
          {/* Tooltip mejorado */}
          <div className="absolute right-0 top-16 bg-gray-900/95 backdrop-blur-sm text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl border border-gray-700">
            <div className="flex items-center gap-2">
              {itemCount > 0 ? (
                <>
                  <Package className="w-4 h-4 text-green-400" />
                  <span>Ver carrito ({itemCount} productos)</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-gray-100" />
                  <span>Tu carrito está vacío</span>
                </>
              )}
            </div>
            <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900/95 transform rotate-45 border-l border-t border-gray-700"></div>
          </div>
        </div>
      </Link>

      {/* Animación de producto añadido */}
      {showAddedAnimation && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 max-w-xs border border-green-400">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">¡Producto añadido!</span>
            <button
              onClick={() => setShowAddedAnimation(false)}
              className="ml-2 text-white/80 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Alerta de carrito vacío mejorada */}
      {showEmptyAlert && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 max-w-xs border border-yellow-300">
            <ShoppingCart className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Tu carrito está vacío</span>
            <button
              onClick={() => setShowEmptyAlert(false)}
              className="ml-2 text-black/60 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart; 