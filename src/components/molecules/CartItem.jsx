import { memo } from "react";

const CartItem = memo(({ item }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">{item.image}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">Cantidad: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} c/u</p>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem; 