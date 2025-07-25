import React from "react";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import Button from "../atoms/Button";

const ProductImageModal = ({ isOpen, onClose, product, productImageUrl }) => {
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => prev + 90);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <span className="text-white text-sm sm:text-lg">{product.image}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base md:text-xl font-bold text-gray-900 truncate">{product.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{product.category}</p>
            </div>
          </div>
          
          <Button
            variant="secondary"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 overflow-hidden bg-gray-100">
          <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 lg:h-[500px] p-3 sm:p-4 md:p-8">
            <div
              className="relative transition-all duration-300 ease-out"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            >
              <img
                src={productImageUrl}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback si la imagen no carga */}
              <div 
                className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-4xl sm:text-6xl"
                style={{ display: 'none' }}
              >
                {product.image}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 md:p-6 border-t border-gray-200 gap-3 sm:gap-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="secondary"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <span className="text-xs sm:text-sm text-gray-600 min-w-[50px] sm:min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button
              variant="secondary"
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleRotate}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
            >
              <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
            >
              Reset
            </Button>
            
            <Button
              variant="danger"
              onClick={onClose}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageModal; 