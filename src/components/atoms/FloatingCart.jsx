import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';

const FloatingCart = ({
  itemCount = 0,
  className = '',
  previousItemCount = 0,
}) => {
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

  const handleCartClick = e => {
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
        to='/cart'
        className={`fixed top-6 right-6 z-50 group ${className}`}
        onClick={handleCartClick}
      >
        <div className='relative'>
          {/* Icono del carrito con animación */}
          <div
            className={`
            w-14 h-14 
            bg-gradient-to-br from-[#F9C81E] via-[#F9C81E] to-red-500 
            hover:from-[#F9C81E]/80 hover:via-[#F9C81E]/90 hover:to-red-600 
            rounded-full flex items-center justify-center 
            shadow-lg hover:shadow-xl 
            transition-all duration-300 ease-out
            group-hover:scale-110 group-hover:rotate-3
            ${isAnimating ? 'animate-bounce scale-125' : ''}
            ${showAddedAnimation ? 'ring-4 ring-green-400 ring-opacity-75' : ''}
            backdrop-blur-sm
          `}
          >
            <ShoppingCart className='w-6 h-6 text-white drop-shadow-sm' />
          </div>

          {/* Badge con número de productos */}
          {itemCount > 0 && (
            <div
              className={`
              absolute -top-2 -right-2 
              w-6 h-6 
              bg-gradient-to-br from-red-500 to-red-600
              text-white text-xs font-bold 
              rounded-full flex items-center justify-center 
              shadow-lg
              ${isAnimating ? 'animate-ping scale-150' : 'animate-pulse'}
              transition-all duration-300
            `}
            >
              {itemCount > 99 ? '99+' : itemCount}
            </div>
          )}
        </div>
      </Link>

      {/* Animación de producto añadido */}
      {showAddedAnimation && (
        <div className='fixed top-20 right-6 z-50 animate-bounce'>
          <div className='bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 max-w-xs border border-green-400'>
            <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
            <span className='text-sm font-medium'>¡Producto añadido!</span>
            <button
              onClick={() => setShowAddedAnimation(false)}
              className='ml-2 text-white/80 hover:text-white transition-colors'
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Alerta de carrito vacío mejorada */}
      {showEmptyAlert && (
        <div className='fixed top-20 right-6 z-50 animate-bounce'>
          <div className='bg-gradient-to-r from-yellow-400 to-[#F9C81E] text-black font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 max-w-xs border border-yellow-300'>
            <ShoppingCart className='w-5 h-5 flex-shrink-0' />
            <span className='text-sm font-medium'>Tu carrito está vacío</span>
            <button
              onClick={() => setShowEmptyAlert(false)}
              className='ml-2 text-black/60 hover:text-black transition-colors'
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
