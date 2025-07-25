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
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">{item.image}</span>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 text-sm">{item.description}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Controles de cantidad */}
        <button
          onClick={handleDecrease}
          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        <span className="w-12 text-center font-medium text-gray-800">
          {item.quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="text-xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
        <p className="text-sm text-gray-500">${price.toFixed(2)} c/u</p>
      </div>
      
      <button
        onClick={onRemove}
        className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
        title="Eliminar producto"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem; 