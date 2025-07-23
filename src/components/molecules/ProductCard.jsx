import { memo } from "react";
import Button from "../atoms/Button";

const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">{product.image}</span>
          </div>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-2xl font-bold text-blue-600 mb-4">{product.price}</p>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => onAddToCart?.(product)}
        >
          🛒 Agregar al Carrito
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 