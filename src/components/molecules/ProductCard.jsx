import { memo, useState } from "react";
import { Eye, Star, Image as ImageIcon, ShoppingCart } from "lucide-react";
import Button from "../atoms/Button";
import ProductImageModal from "./ProductImageModal";
import categoryColorsData from "../../data/category-colors.json";
import productImagesData from "../../data/product-images.json";

const ProductCard = memo(({ product, onAddToCart }) => {
  const [showDesc, setShowDesc] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Función para obtener color de categoría desde JSON
  const getCategoryColor = (category) => {
    return categoryColorsData.categoryColors[category] || 'from-gray-500/20 to-slate-500/20';
  };

  // Función para obtener imagen del producto desde JSON
  const getProductImage = (productName, category) => {
    try {
      return productImagesData.productImages[category]?.[productName] || null;
    } catch (error) {
      console.error('Error getting product image:', error);
      return null;
    }
  };

  const productImageUrl = getProductImage(product.name, product.category);

  return (
    <>
      <div
        className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-white/40 overflow-hidden"
        onMouseEnter={() => setShowDesc(true)}
        onMouseLeave={() => setShowDesc(false)}
        onTouchStart={() => setShowDesc((v) => !v)}
      >
        {/* Efecto de brillo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Fondo de categoría */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(product.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="p-3 sm:p-4 md:p-6 relative z-10">
          {/* Header con categoría y rating */}
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/30 group-hover:bg-white/30 transition-all duration-300">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full"></span>
              <span className="hidden sm:inline">{product.category}</span>
              <span className="sm:hidden">{product.category.length > 8 ? product.category.substring(0, 8) + '...' : product.category}</span>
            </span>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span className="text-[10px] sm:text-xs font-medium">4.8</span>
            </div>
          </div>

          {/* Imagen del producto */}
          <div className="relative mb-3 sm:mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border border-white/30 flex items-center justify-center group-hover:from-white/30 group-hover:to-white/20 transition-all duration-300 shadow-lg overflow-hidden">
              {productImageUrl ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-xl sm:rounded-2xl animate-pulse flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400" />
                    </div>
                  )}
                  <img
                    src={productImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-110"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(false)}
                  />
                </>
              ) : (
                <span className="text-xl sm:text-2xl md:text-3xl select-none relative z-10">
                  {product.image}
                </span>
              )}
            </div>
            
            {/* Badge de descuento (opcional) */}
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg transform rotate-12">
              -15%
            </div>
          </div>

          {/* Información del producto */}
          <div className="text-center mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2 group-hover:text-orange-300 transition-colors duration-300 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            
            {/* Precio */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300">
                {product.price}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 line-through hidden sm:block">
                ${(parseFloat(product.price.replace('$', '')) * 1.15).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant="fire"
              className="flex-1 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 group-hover:shadow-lg group-hover:shadow-orange-500/30 py-1.5 sm:py-2 flex items-center justify-center"
              onClick={() => onAddToCart?.(product)}
            >
              +
            </Button>
            
            <Button
              variant="secondary"
              className="px-2 sm:px-3 transition-all duration-300 hover:scale-105 group-hover:shadow-lg py-1.5 sm:py-2"
              onClick={() => setShowImageModal(true)}
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Descripción elegante */}
          {showDesc && product.description && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 sm:mt-3 w-64 sm:w-72 bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-md text-white text-xs sm:text-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 z-30 border border-white/20 shadow-2xl">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm">{product.image}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-300 mb-1 text-xs sm:text-sm">{product.name}</h4>
                  <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">{product.description}</p>
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <span className="text-[10px] sm:text-xs text-gray-400">Categoría: {product.category}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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