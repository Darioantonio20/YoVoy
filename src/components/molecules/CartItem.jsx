import { memo, useState } from 'react';
import { Trash2, Plus, Minus, MessageCircle } from 'lucide-react';

const CartItem = memo(({ item, onRemove, onUpdateQuantity, onUpdateNote }) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price?.replace('$', '').replace(',', '') || '0');
  const totalPrice = price * item.quantity;

  const handleIncrease = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  const handleDecrease = () => {
    onUpdateQuantity(item.quantity - 1);
  };

  return (
    <div className='flex flex-col gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10'>
      {/* Contenedor superior: imagen, nombre y descripción */}
      <div className='flex gap-3 sm:gap-4 w-full'>
        {/* Imagen del producto */}
        <div className='w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10 overflow-hidden'>
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              className='w-full h-full object-cover'
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span className='text-xl sm:text-2xl' style={{ display: item.image ? 'none' : 'flex' }}>
            🍕
          </span>
        </div>

        {/* Información del producto */}
        <div className='flex-1 min-w-0'>
          <h3 className='text-base sm:text-lg font-semibold text-white'>
            {item.name}
          </h3>
          <p className='text-white/70 text-sm'>{item.description}</p>
          {item.adminNote && (
            <div className='flex items-center gap-2 mt-2'>
              <div className='w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30'>
                <span className='text-yellow-400 text-xs'>📝</span>
              </div>
              <p className='text-sm text-yellow-300/90 italic'>
                {item.adminNote}
              </p>
            </div>
          )}
        </div>

        {/* Precio en mobile */}
        <div className='flex flex-col items-end sm:hidden'>
          <p className='text-base font-bold text-orange-400'>
            ${totalPrice.toFixed(2)}
          </p>
          <p className='text-xs text-white/60'>
            ${price.toFixed(2)} c/u
          </p>
        </div>
      </div>

      {/* Contenedor de notas */}
      <div className='w-full pl-[3.5rem] sm:pl-[4rem]'>
        {isEditingNote ? (
          <div className='flex flex-col sm:flex-row gap-2 w-full'>
            <input
              type="text"
              defaultValue={item.note || ''}
              placeholder="Agregar nota"
              className='flex-1 h-8 px-3 text-sm bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onUpdateNote(e.target.value);
                  setIsEditingNote(false);
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder="Agregar nota"]');
                onUpdateNote(input.value);
                setIsEditingNote(false);
              }}
              className='h-8 px-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center whitespace-nowrap'
            >
              Guardar
            </button>
          </div>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {item.note ? (
              <p className='text-sm text-white/80 italic break-all flex-grow'>
                <span className='font-medium text-orange-400/80'>Nota:</span> {item.note}
              </p>
            ) : null}
            <button
              onClick={() => setIsEditingNote(true)}
              className='flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors bg-orange-500/10 hover:bg-orange-500/20 px-3 h-8 rounded-lg whitespace-nowrap'
            >
              <MessageCircle className='w-4 h-4' />
              <span className='font-medium'>{item.note ? 'Editar nota' : 'Agregar nota'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Contenedor inferior: controles y precio */}
      <div className='flex items-center gap-3 sm:gap-4 justify-between sm:justify-end w-full border-t border-white/10 pt-3 sm:pt-4'>
        {/* Controles de cantidad */}
        <div className='flex items-center gap-2'>
          <button
            onClick={handleDecrease}
            className='w-7 h-7 sm:w-8 sm:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10'
          >
            <Minus className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white' />
          </button>

          <span className='w-7 sm:w-8 text-center font-medium text-white text-sm sm:text-base'>
            {item.quantity}
          </span>

          <button
            onClick={handleIncrease}
            className='w-7 h-7 sm:w-8 sm:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10'
          >
            <Plus className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white' />
          </button>
        </div>

        {/* Precio - visible solo en desktop */}
        <div className='hidden sm:block text-right min-w-[90px]'>
          <p className='text-lg font-bold text-orange-400'>
            ${totalPrice.toFixed(2)}
          </p>
          <p className='text-xs text-white/60'>
            ${price.toFixed(2)} c/u
          </p>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={onRemove}
          className='w-7 h-7 sm:w-8 sm:h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0 border border-red-500/30'
          title='Eliminar producto'
        >
          <Trash2 className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400' />
        </button>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
