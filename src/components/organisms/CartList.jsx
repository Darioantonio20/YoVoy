import { memo } from "react";
import CartItem from "../molecules/CartItem";

const CartList = memo(({ items, onRemoveItem, onUpdateQuantity }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="space-y-6">
        {items.map((item) => (
          <CartItem 
            key={item.id} 
            item={item} 
            onRemove={() => onRemoveItem(item.id)}
            onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
          />
        ))}
      </div>
    </div>
  );
});

CartList.displayName = 'CartList';

export default CartList; 