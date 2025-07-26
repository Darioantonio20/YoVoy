import React from 'react';

const BackgroundDecorator = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Círculos flotantes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-green-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
      
      {/* Líneas decorativas */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
      <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
    </div>
  );
};

export default BackgroundDecorator; 