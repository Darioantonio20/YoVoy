import { memo, useState } from 'react';
import { Eye, Star, Image as ImageIcon, FileText } from 'lucide-react';
import Button from '../atoms/Button';
import ProductImageModal from './ProductImageModal';
import categoryColorsData from '../../data/category-colors.json';

const ProductCard = memo(({ product, onAddToCart }) => {
  const [showDesc, setShowDesc] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Función para obtener color de categoría desde JSON
  const getCategoryColor = category => {
    return (
      categoryColorsData.categoryColors[category] ||
      'from-gray-500/20 to-slate-500/20'
    );
  };

  // Obtener imagen del producto desde la API
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return price || '$0.00';
  };

  const productImageUrl = getProductImage();
  const formattedPrice = formatPrice(product.price);

  return (
    <>
      <div
        className='group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#F9C81E]/20 hover:border-white/40 overflow-hidden'
        onMouseEnter={() => setShowDesc(true)}
        onMouseLeave={() => setShowDesc(false)}
        onTouchStart={() => setShowDesc(v => !v)}
      >
        {/* Efecto de brillo animado */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000' />

        {/* Fondo de categoría */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(product.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div className='p-3 sm:p-4 md:p-6 relative z-10'>
          {/* Header con categoría y stock */}
          <div className='flex items-center justify-between mb-2 sm:mb-3 md:mb-4'>
            <span className='inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/30 group-hover:bg-white/30 transition-all duration-300'>
              <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F9C81E] rounded-full'></span>
              <span className='hidden sm:inline'>{product.category}</span>
              <span className='sm:hidden'>
                {product.category && product.category.length > 8
                  ? product.category.substring(0, 8) + '...'
                  : product.category || 'Sin categoría'}
              </span>
            </span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              product.stock > 10 ? 'text-green-400 bg-green-500/20' :
              product.stock > 0 ? 'text-yellow-400 bg-yellow-500/20' :
              'text-red-400 bg-red-500/20'
            }`}>
              <span className='w-1.5 h-1.5 rounded-full bg-current'></span>
              <span className='hidden sm:inline'>
                {product.stock > 10 ? `${product.stock} disponibles` :
                 product.stock > 0 ? `${product.stock} disponibles` :
                 'Sin stock'}
              </span>
              <span className='sm:hidden'>
                {product.stock > 0 ? `${product.stock}` : '0'}
              </span>
            </div>
          </div>

          {/* Imagen del producto */}
          <div className='relative mb-3 sm:mb-4'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center group-hover:from-white/30 group-hover:to-white/20 transition-all duration-300 shadow-lg overflow-hidden'>
              {productImageUrl ? (
                <>
                  {!imageLoaded && (
                    <div className='absolute inset-0 bg-gradient-to-br from-[#F9C81E]/20 to-red-400/20 rounded-xl sm:rounded-2xl animate-pulse flex items-center justify-center'>
                      <ImageIcon className='w-4 h-4 sm:w-6 sm:h-6 text-[#F9C81E]' />
                    </div>
                  )}
                  <img
                    src={productImageUrl}
                    alt={product.name}
                    className='w-full h-full object-cover rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-110'
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(false)}
                  />
                </>
              ) : (
                <span className='text-xl sm:text-2xl md:text-3xl select-none relative z-10'>
                  🍕
                </span>
              )}
            </div>


          </div>

          {/* Información del producto */}
          <div className='text-center mb-3 sm:mb-4'>
            <h3 className='text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-[#F9C81E] transition-colors duration-300 line-clamp-2 leading-tight'>
              {product.name}
            </h3>

            {/* Precio */}
            <div className='flex items-center justify-center mb-2 sm:mb-3'>
              <span className='text-lg sm:text-xl md:text-2xl font-bold text-[#F9C81E] group-hover:text-[#F9C81E] transition-colors duration-300'>
                {formattedPrice}
              </span>
            </div>

            {/* Nota del admin - Mini sección (siempre reserva espacio) */}
            <div className='mb-2 h-[52px] sm:h-[56px]'>
              {product.adminNote ? (
                <div className='h-full p-1.5 sm:p-2 bg-[#F9C81E]/20 border border-[#F9C81E]/30 rounded-lg'>
                  <div className='flex items-center gap-1 mb-1'>
                    <FileText size={10} className='text-[#F9C81E] flex-shrink-0' />
                    <span className='text-[#F9C81E] text-[10px] sm:text-xs font-medium'>Nota del vendedor:</span>
                  </div>
                  <p className='text-[#F9C81E]/80 text-[10px] sm:text-xs leading-relaxed line-clamp-2'>
                    {product.adminNote}
                  </p>
                </div>
              ) : (
                <div className='h-full'></div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className='flex gap-1.5 sm:gap-2'>
            <Button
              variant='fire'
              className='flex-1 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#F9C81E]/30 py-1.5 sm:py-2 flex items-center justify-center'
              onClick={() => onAddToCart?.(product)}
              disabled={!product.stock || product.stock <= 0}
            >
              {!product.stock || product.stock <= 0 ? 'Sin stock' : '+'}
            </Button>

            <Button
              variant='secondary'
              className='px-2 sm:px-3 transition-all duration-300 hover:scale-105 group-hover:shadow-lg py-1.5 sm:py-2'
              onClick={() => setShowImageModal(true)}
            >
              <Eye className='w-3 h-3 sm:w-4 sm:h-4' />
            </Button>
          </div>

         
        </div>
      </div>

      {/* Modal de imagen del producto */}
      <ProductImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        product={product}
        productImageUrl={productImageUrl}
      />
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
