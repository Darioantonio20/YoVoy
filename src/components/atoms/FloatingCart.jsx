import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";

const FloatingCart = ({ itemCount = 0, className = "" }) => {
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);
  const location = useLocation();
  const isInStore = location.pathname === '/store';

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
          {/* Icono del carrito */}
          <div className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          
          {/* Badge con número de productos */}
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {itemCount > 99 ? "99+" : itemCount}
            </div>
          )}
          
          {/* Tooltip */}
          <div className="absolute right-0 top-16 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {itemCount > 0 ? `Ver carrito (${itemCount} productos)` : "Tu carrito está vacío"}
            <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
          </div>
        </div>
      </Link>

      {/* Alerta de carrito vacío */}
      {showEmptyAlert && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="bg-yellow-400 text-black px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-xs">
            <ShoppingCart className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Tu carrito está vacío</span>
            <button
              onClick={() => setShowEmptyAlert(false)}
              className="ml-2 text-yellow/80 hover:text-yellow transition-colors"
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