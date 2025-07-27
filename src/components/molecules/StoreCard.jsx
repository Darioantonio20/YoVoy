import { useState } from 'react';
import { MapPin, Star, Clock, Eye } from 'lucide-react';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import storesImagesData from '../../data/stores-images.json';

const StoreCard = ({ store, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Obtener datos de la imagen de la tienda
  const getStoreImageData = storeId => {
    return (
      storesImagesData.stores[storeId] || {
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        location: 'Ubicación no disponible',
        address: 'Dirección no disponible',
      }
    );
  };

  const storeImageData = getStoreImageData(store.id);

  return (
    <div
      className='group relative overflow-hidden bg-white rounded-2xl shadow-lg cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 transform-gpu h-80'
      onClick={() => onSelect(store)}
    >
      {/* Imagen de fondo */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700'
        style={{ backgroundImage: `url(${storeImageData.image})` }}
      >
        {/* Overlay gradiente para mejor legibilidad */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent'></div>
      </div>

      {/* Indicador de carga */}
      {!imageLoaded && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center'>
          <div className='w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      )}

      {/* Contenido */}
      <div className='relative z-10 h-full flex flex-col justify-between p-6'>
        {/* Header con categoría */}
        <div className='flex justify-between items-start'>
          <span className='inline-block bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-orange-400/50'>
            {store.category}
          </span>

          {/* Rating */}
          <div className='flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1'>
            <Star className='w-3 h-3 text-yellow-400 fill-current' />
            <span className='text-white text-xs font-medium'>4.8</span>
          </div>
        </div>

        {/* Información principal */}
        <div className='flex-1 flex flex-col justify-end'>
          {/* Nombre de la tienda */}
          <h3 className='text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300 line-clamp-2'>
            {store.name}
          </h3>

          {/* Ubicación */}
          <div className='flex items-center space-x-2 mb-3'>
            <MapPin className='w-4 h-4 text-orange-400' />
            <Text className='text-white/90 text-sm font-medium'>
              {storeImageData.location}
            </Text>
          </div>

          {/* Dirección */}
          <Text className='text-white/70 text-xs mb-4 line-clamp-2'>
            {storeImageData.address}
          </Text>

          {/* Footer con botón y horario */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
            <div className='flex items-center space-x-2 text-white/70 text-xs justify-center'>
              <Clock className='w-3 h-3' />
              <span>Abierto</span>
            </div>

            <div className='flex justify-center sm:justify-end'>
              <Button
                variant='fire'
                className='text-xs py-2 px-4 font-semibold group-hover:scale-105 transition-transform duration-200'
                onClick={e => {
                  e.stopPropagation();
                  onSelect(store);
                }}
              >
                <Eye className='text-center w-3 h-3 sm:w-4 sm:h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de brillo */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>

      {/* Imagen oculta para precargar */}
      <img
        src={storeImageData.image}
        alt={store.name}
        className='hidden'
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default StoreCard;
