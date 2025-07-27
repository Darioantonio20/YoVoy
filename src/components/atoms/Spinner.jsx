import React from 'react';

const Spinner = ({ message = 'Cargando...' }) => {
  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 flex flex-col items-center'>
        {/* Spinner animado */}
        <div className='w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4'></div>

        {/* Texto de carga */}
        <p className='text-white text-lg font-medium'>{message}</p>

        {/* Puntos animados */}
        <div className='flex space-x-1 mt-2'>
          <div
            className='w-2 h-2 bg-white rounded-full animate-bounce'
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className='w-2 h-2 bg-white rounded-full animate-bounce'
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className='w-2 h-2 bg-white rounded-full animate-bounce'
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
