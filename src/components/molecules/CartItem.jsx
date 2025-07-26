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
    <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      {/* Imagen del producto */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
        <span className="text-2xl sm:text-3xl">{item.image}</span>
      </div>
      
      {/* Información del producto */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h3 className="text-lg sm:text-xl font-semibold text-white">{item.name}</h3>
        <p className="text-white/70 text-sm sm:text-base">{item.description}</p>
      </div>
      
      {/* Controles de cantidad - responsive */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10"
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
        
        <span className="w-12 sm:w-16 text-center font-medium text-white text-lg sm:text-xl">
          {item.quantity}
        </span>
        
        <button
          onClick={handleIncrease}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>
      
      {/* Precio */}
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold text-orange-400">${totalPrice.toFixed(2)}</p>
        <p className="text-sm sm:text-base text-white/60">${price.toFixed(2)} c/u</p>
      </div>
      
      {/* Botón eliminar */}
      <button
        onClick={onRemove}
        className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0 border border-red-500/30"
        title="Eliminar producto"
      >
        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
      </button>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem; 