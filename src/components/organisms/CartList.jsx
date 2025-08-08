import { memo } from 'react';
import CartItem from '../molecules/CartItem';

const CartList = memo(({ items, onRemoveItem, onUpdateQuantity, onUpdateNote, originalProducts }) => {
  return (
    <div className='bg-black/20 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8'>
      <div className='space-y-4 sm:space-y-6'>
        {items.map(item => (
          <CartItem
            key={item.productId}
            item={item}
            onRemove={() => onRemoveItem(item.productId)}
            onUpdateQuantity={quantity => onUpdateQuantity(item.productId, quantity)}
            onUpdateNote={note => onUpdateNote(item.productId, note)}
            originalProduct={originalProducts?.[item.productId]}
          />
        ))}
      </div>
    </div>
  );
});

CartList.displayName = 'CartList';

export default CartList;
