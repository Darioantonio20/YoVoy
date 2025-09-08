import { useState } from 'react';
import { MapPin, Star, Clock, Eye, ExternalLink } from 'lucide-react';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const StoreCard = ({ store, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Obtener imagen de la tienda desde la API
  const getStoreImage = () => {
    if (store.images && store.images.length > 0) {
      return store.images[0];
    }
    // Imagen por defecto si no hay imágenes
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
  };

  // Obtener ubicación de la tienda
  const getStoreLocation = () => {
    if (store.location && store.location.alias) {
      return store.location.alias;
    }
    return 'Ubicación no disponible';
  };

  // Obtener dirección de la tienda
  const getStoreAddress = () => {
    if (store.location && store.location.googleMapsUrl) {
      return store.location.googleMapsUrl;
    }
    return 'Dirección no disponible';
  };

  // Obtener categorías de la tienda
  const getStoreCategories = () => {
    if (store.categories && store.categories.length > 0) {
      return store.categories[0]; // Mostrar solo la primera categoría
    }
    return 'Sin categoría';
  };

  // Verificar si la tienda está abierta
  const isStoreOpen = () => {
    if (!store.schedule || store.schedule.length === 0) {
      return true; // Si no hay horario, asumir que está abierta
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const todaySchedule = store.schedule.find(s => 
      s.day.toLowerCase() === currentDay.toLowerCase()
    );

    if (!todaySchedule || !todaySchedule.isOpen) {
      return false;
    }

    return currentTime >= todaySchedule.openTime && currentTime <= todaySchedule.closeTime;
  };

  const storeImage = getStoreImage();
  const storeLocation = getStoreLocation();
  const storeAddress = getStoreAddress();
  const storeCategory = getStoreCategories();
  const isOpen = isStoreOpen();

  // Función para verificar si hay redes sociales
  const hasSocialMedia = () => {
    return store.socialMedia && (
      store.socialMedia.tiktok || 
      store.socialMedia.facebook || 
      store.socialMedia.instagram
    );
  };

  // Función para manejar clic en redes sociales
  const handleSocialMediaClick = (platform, url, e) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Función para manejar clic en la ubicación
  const handleLocationClick = (e) => {
    e.stopPropagation();
    if (store.location?.googleMapsUrl) {
      window.open(store.location.googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className='group relative overflow-hidden bg-white rounded-2xl shadow-lg cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#F9C81E]/30 transform-gpu h-80'
      onClick={() => onSelect(store)}
    >
      {/* Imagen de fondo */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700'
        style={{ backgroundImage: `url(${storeImage})` }}
      >
        {/* Overlay gradiente para mejor legibilidad */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent'></div>
      </div>

      {/* Indicador de carga */}
      {!imageLoaded && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center'>
          <div className='w-8 h-8 border-4 border-[#F9C81E] border-t-transparent rounded-full animate-spin'></div>
        </div>
      )}

      {/* Contenido */}
      <div className='relative z-10 h-full flex flex-col justify-between p-6'>
        {/* Header con categoría */}
        <div className='flex justify-between items-start'>
          <span className='inline-block bg-[#F9C81E]/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-[#F9C81E]/50'>
            {storeCategory}
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
          <h3 className='text-xl font-bold text-white mb-2 group-hover:text-[#F9C81E] transition-colors duration-300 line-clamp-2'>
            {store.name}
          </h3>

          {/* Descripción */}
          {store.description && (
            <Text className='text-white/80 text-sm mb-3 line-clamp-2'>
              {store.description}
            </Text>
          )}

          {/* Ubicación */}
          <div className='flex items-center space-x-2 mb-3'>
            <MapPin className='w-4 h-4 text-[#F9C81E]' />
            {store.location?.googleMapsUrl ? (
              <button
                onClick={handleLocationClick}
                className='text-white/90 text-sm font-medium hover:text-[#F9C81E] transition-colors duration-200 underline decoration-[#F9C81E]/50 hover:decoration-[#F9C81E] cursor-pointer'
                title='Ver en Google Maps'
              >
                {storeLocation}
              </button>
            ) : (
              <Text className='text-white/90 text-sm font-medium'>
                {storeLocation}
              </Text>
            )}
          </div>

          {/* Redes Sociales */}
          {hasSocialMedia() && (
            <div className='flex items-center justify-center space-x-3 mb-3'>
              {store.socialMedia?.tiktok && (
                <button
                  onClick={(e) => handleSocialMediaClick('tiktok', store.socialMedia.tiktok, e)}
                  className='w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200 hover:scale-110 group-hover:bg-[#F9C81E]/20'
                  title='Síguenos en TikTok'
                >
                  <svg className='w-4 h-4 text-white' viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.35 3.12-5.35 3.47-2.26.39-4.52-.13-6.44-1.28-1.92-1.15-3.35-3.12-3.47-5.35-.12-2.22.13-4.52 1.28-6.44 1.15-1.92 3.12-3.35 5.35-3.47 1.4-.08 2.79.54 3.94 1.35.01-2.92-.01-5.84.02-8.75.08-1.4.54-2.79 1.35-3.94 1.31-1.92 3.35-3.12 5.35-3.47 2.26-.39 4.52.13 6.44 1.28 1.92 1.15 3.35 3.12 3.47 5.35.12 2.22-.13 4.52-1.28 6.44-1.15 1.92-3.12 3.35-5.35 3.47-1.4.08-2.79-.54-3.94-1.35z"/>
                  </svg>
                </button>
              )}
              
              {store.socialMedia?.facebook && (
                <button
                  onClick={(e) => handleSocialMediaClick('facebook', store.socialMedia.facebook, e)}
                  className='w-8 h-8 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 hover:scale-110 group-hover:bg-blue-500/20'
                  title='Síguenos en Facebook'
                >
                  <svg className='w-4 h-4 text-white' viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              )}
              
              {store.socialMedia?.instagram && (
                <button
                  onClick={(e) => handleSocialMediaClick('instagram', store.socialMedia.instagram, e)}
                  className='w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 backdrop-blur-sm rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-110 group-hover:from-purple-400 group-hover:to-pink-400'
                  title='Síguenos en Instagram'
                >
                  <svg className='w-4 h-4 text-white' viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Footer con botón y horario */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
            <div className='flex items-center space-x-2 text-white/70 text-xs justify-center'>
              <Clock className='w-3 h-3' />
              <span className={isOpen ? 'text-green-400' : 'text-red-400'}>
                {isOpen ? 'Abierto' : 'Cerrado'}
              </span>
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
        src={storeImage}
        alt={store.name}
        className='hidden'
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default StoreCard;
