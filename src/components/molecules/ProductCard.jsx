import { memo, useState } from "react";
import Button from "../atoms/Button";

const ProductCard = memo(({ product, onAddToCart }) => {
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div
      className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg transition-all duration-200 transform group hover:scale-105 hover:shadow-xl hover:border-white/40 overflow-hidden"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
      onTouchStart={() => setShowDesc((v) => !v)}
    >
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-4 sm:p-6 relative z-10">
        <div className="text-center mb-3">
          {/* Imagen simplificada */}
          <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center bg-white/20 border border-white/30 group-hover:bg-white/30 transition-colors duration-200">
            <span className="text-2xl select-none">
              {product.image}
            </span>
          </div>
          <span className="inline-block bg-white/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/30">
            {product.category}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
          {product.name}
        </h3>
        <p className="text-lg sm:text-2xl font-bold text-orange-400 mb-2">
          {product.price}
        </p>
        <Button
          variant="fire"
          className="w-full text-xs sm:text-sm transition-all duration-200 hover:scale-105"
          onClick={() => onAddToCart?.(product)}
        >
          🛒 Agregar 
        </Button>
        {/* Descripción simple */}
        {showDesc && product.description && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 sm:w-64 bg-black/80 text-white text-xs rounded-lg p-2 sm:p-3 z-20 border border-white/20">
            {product.description}
          </div>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 