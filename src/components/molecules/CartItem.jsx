import { memo } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

const CartItem = memo(({ item, onRemove, onUpdateQuantity }) => {
  const price = parseFloat(item.price.replace('$', '').replace(',', ''));
  const totalPrice = price * item.quantity;

  const handleIncrease = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  const handleDecrease = () => {
    onUpdateQuantity(item.quantity - 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
      {/* Imagen del producto */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-2xl sm:text-3xl">{item.image}</span>
      </div>
      
      {/* Información del producto */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
      </div>
      
      {/* Controles de cantidad - responsive */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
        
        <span className="w-12 sm:w-16 text-center font-medium text-gray-800 text-lg sm:text-xl">
          {item.quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>
      
      {/* Precio */}
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
        <p className="text-sm sm:text-base text-gray-500">${price.toFixed(2)} c/u</p>
      </div>
      
      {/* Botón eliminar */}
      <button
        onClick={onRemove}
        className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
        title="Eliminar producto"
      >
        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
      </button>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem; 