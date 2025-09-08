import React, { useState, useEffect } from 'react';
import { Save, X, Monitor, Shirt, Baby, Utensils, Home, Sprout, Dog, Trophy, Palette, BookOpen, Music, Palette as Art, Car, Wrench, Lightbulb, Zap, Smartphone } from 'lucide-react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';

const StoreForm = ({ storeData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: { alias: '', googleMapsUrl: '' },
    store: {
      name: '',
      responsibleName: '',
      phone: '',
      categories: [],
      description: '',
      images: [],
      location: { alias: '', googleMapsUrl: '' },
      schedule: [
        { day: 'Lunes', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Martes', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Miércoles', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Jueves', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Viernes', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { day: 'Sábado', openTime: '09:00', closeTime: '14:00', isOpen: true },
        { day: 'Domingo', openTime: '00:00', closeTime: '00:00', isOpen: false }
      ],
      socialMedia: {
        tiktok: '',
        facebook: '',
        instagram: ''
      }
    }
  });

  useEffect(() => {
    if (storeData) {
      // Mapear los datos de la API a la estructura del formulario
      const mappedData = {
        name: storeData.ownerId?.name || '',
        email: storeData.ownerId?.email || '',
        phone: storeData.ownerId?.phone || '',
        location: {
          alias: storeData.ownerId?.location?.alias || '',
          googleMapsUrl: storeData.ownerId?.location?.googleMapsUrl || ''
        },
        store: {
          name: storeData.name || '',
          responsibleName: storeData.responsibleName || '',
          phone: storeData.phone || '',
          categories: storeData.categories || [],
          description: storeData.description || '',
          images: storeData.images || [],
          location: {
            alias: storeData.location?.alias || '',
            googleMapsUrl: storeData.location?.googleMapsUrl || ''
          },
          schedule: storeData.schedule || [
            { day: 'Lunes', openTime: '09:00', closeTime: '18:00', isOpen: true },
            { day: 'Martes', openTime: '09:00', closeTime: '18:00', isOpen: true },
            { day: 'Miércoles', openTime: '09:00', closeTime: '18:00', isOpen: true },
            { day: 'Jueves', openTime: '09:00', closeTime: '18:00', isOpen: true },
            { day: 'Viernes', openTime: '09:00', closeTime: '18:00', isOpen: true },
            { day: 'Sábado', openTime: '09:00', closeTime: '14:00', isOpen: true },
            { day: 'Domingo', openTime: '00:00', closeTime: '00:00', isOpen: false }
          ],
          socialMedia: storeData.socialMedia || {
            tiktok: '',
            facebook: '',
            instagram: ''
          }
        }
      };
      
      setFormData(mappedData);
    }
  }, [storeData]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleStoreInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      store: {
        ...prev.store,
        [field]: value
      }
    }));
  };

  const handleStoreLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      store: {
        ...prev.store,
        location: {
          ...prev.store.location,
          [field]: value
        }
      }
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      store: {
        ...prev.store,
        socialMedia: {
          ...prev.store.socialMedia,
          [platform]: value
        }
      }
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...(formData.store?.schedule || [])];
    updatedSchedule[index] = {
      ...updatedSchedule[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      store: {
        ...prev.store,
        schedule: updatedSchedule
      }
    }));
  };

  const handleCategoryChange = (categoryId, isChecked) => {
    setFormData(prev => ({
      ...prev,
      store: {
        ...prev.store,
        categories: isChecked
          ? [...prev.store.categories, categoryId]
          : prev.store.categories.filter(id => id !== categoryId)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar solo los datos de la tienda para el PUT
    const storeUpdateData = {
      name: formData.store?.name || '',
      responsibleName: formData.store?.responsibleName || '',
      phone: formData.store?.phone || '',
      categories: formData.store?.categories || [],
      description: formData.store?.description || '',
      images: formData.store?.images || [],
      location: {
        alias: formData.store?.location?.alias || '',
        googleMapsUrl: formData.store?.location?.googleMapsUrl || ''
      },
      schedule: formData.store?.schedule || [],
      socialMedia: formData.store?.socialMedia || {
        tiktok: '',
        facebook: '',
        instagram: ''
      }
    };
    
    onSave(storeUpdateData);
  };

  const categories = [
    { id: 'tecnologia', label: 'tecnologia', icon: Monitor, color: 'text-blue-400' },
    { id: 'moda', label: 'moda', icon: Shirt, color: 'text-pink-400' },
    { id: 'juguetes', label: 'juguetes', icon: Baby, color: 'text-yellow-400' },
    { id: 'comida', label: 'comida', icon: Utensils, color: 'text-[#F9C81E]' },
    { id: 'hogar', label: 'hogar', icon: Home, color: 'text-green-400' },
    { id: 'jardin', label: 'jardin', icon: Sprout, color: 'text-emerald-400' },
    { id: 'mascotas', label: 'mascotas', icon: Dog, color: 'text-amber-400' },
    { id: 'deportes', label: 'deportes', icon: Trophy, color: 'text-purple-400' },
    { id: 'belleza', label: 'belleza', icon: Palette, color: 'text-rose-400' },
    { id: 'libros', label: 'libros', icon: BookOpen, color: 'text-indigo-400' },
    { id: 'musica', label: 'musica', icon: Music, color: 'text-violet-400' },
    { id: 'arte', label: 'arte', icon: Art, color: 'text-cyan-400' },
    { id: 'automotriz', label: 'automotriz', icon: Car, color: 'text-red-400' },
    { id: 'ferreteria', label: 'ferreteria', icon: Wrench, color: 'text-gray-400' },
  ];

  return (
    <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6'>
      <div className='flex justify-between items-center mb-6'>
        <Text variant='h2' size='xl' className='text-white'>
          <span className='bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
            Información de la Tienda
          </span>
        </Text>
        <Button
          variant='minimal'
          onClick={onCancel}
          className='p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg'
        >
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Información del Administrador */}
        <div className='space-y-4'>
          <Text variant='h3' size='lg' className='text-white/90 border-b border-white/20 pb-2'>
            Datos del Administrador
          </Text>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Nombre del Administrador
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='Nombre del administrador'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='admin@tienda.com'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Teléfono de la Tienda
              </label>
              <input
                type='tel'
                value={formData.store?.phone || ''}
                onChange={(e) => handleStoreInputChange('phone', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='+1 (555) 123-4567'
              />
            </div>
            

          </div>
        </div>

        {/* Información de la Tienda */}
        <div className='space-y-4'>
          <Text variant='h3' size='lg' className='text-white/90 border-b border-white/20 pb-2'>
            Datos de la Tienda
          </Text>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Nombre de la Tienda
              </label>
              <input
                type='text'
                value={formData.store?.name || ''}
                onChange={(e) => handleStoreInputChange('name', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='Nombre de la tienda'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Nombre del Responsable
              </label>
              <input
                type='text'
                value={formData.store?.responsibleName || ''}
                onChange={(e) => handleStoreInputChange('responsibleName', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='Nombre del responsable'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Ubicación de la Tienda
              </label>
              <input
                type='text'
                value={formData.store?.location?.alias || ''}
                onChange={(e) => handleStoreLocationChange('alias', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='Ubicación de la tienda'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                URL de Google Maps
              </label>
              <input
                type='url'
                value={formData.store?.location?.googleMapsUrl || ''}
                onChange={(e) => handleStoreLocationChange('googleMapsUrl', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='https://maps.app.goo.gl/...'
              />
            </div>
          </div>
          
          <div>
            <label className='block text-sm font-medium text-white/90 mb-2'>
              Descripción de la Tienda
            </label>
            <textarea
              value={formData.store?.description || ''}
              onChange={(e) => handleStoreInputChange('description', e.target.value)}
              rows='3'
              className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50 resize-none'
              placeholder='Describe tu tienda y los productos que ofreces'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-white/90 mb-2'>
              Imágenes de la Tienda
            </label>
            <textarea
              value={formData.store?.images?.join(', ') || ''}
              onChange={(e) => handleStoreInputChange('images', e.target.value.split(', ').filter(url => url.trim()))}
              rows='2'
              className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50 resize-none'
              placeholder='URLs de imágenes separadas por comas (ej: https://i.ibb.co/xxx/logo.png, https://i.ibb.co/yyy/banner.png)'
            />
            <p className='text-xs text-white/50 mt-1 flex items-center gap-1'>
              <Lightbulb size={12} className='text-[#F9C81E]' />
              Sube tus imágenes en <a href='https://es.imgbb.com/' target='_blank' rel='noopener noreferrer' className='text-[#F9C81E] hover:text-[#F9C81E]/80 underline'>ImgBB.com</a> y pega las URLs aquí
            </p>
          </div>
        </div>

        {/* Categorías */}
        <div className='space-y-4'>
          <Text variant='h3' size='lg' className='text-white/90 border-b border-white/20 pb-2'>
            Categorías de Productos
          </Text>
          
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
            {categories.map(category => (
              <label
                key={category.id}
                className='relative flex items-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group'
              >
                <input
                  type='checkbox'
                  checked={formData.store?.categories?.includes(category.id) || false}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  className='peer sr-only'
                />
                <div
                  className='w-6 h-6 rounded-lg bg-transparent border-2 border-[#F9C81E]/70 transition-all duration-300 ease-in-out
                    peer-checked:bg-gradient-to-br from-[#F9C81E] to-yellow-400
                    peer-checked:border-0 peer-checked:rotate-12
                    after:content-[""] after:absolute after:top-[22px] after:left-[14px]
                    after:-translate-x-1/2 after:-translate-y-1/2 after:w-4 after:h-4
                    after:opacity-0 after:bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=")]
                    after:bg-contain after:bg-no-repeat peer-checked:after:opacity-100
                    after:transition-opacity after:duration-300
                    hover:shadow-[0_0_15px_rgba(251,146,60,0.5)]'
                ></div>
                <div className='flex items-center gap-2 ml-3'>
                  {category.icon && (
                    <category.icon 
                      size={18} 
                      className={`${category.color} flex-shrink-0`} 
                    />
                  )}
                  <span className='text-sm text-white/90 group-hover:text-white transition-colors'>
                    {category.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Horarios */}
        <div className='space-y-4'>
          <Text variant='h3' size='lg' className='text-white/90 border-b border-white/20 pb-2'>
            Horarios de Atención
          </Text>
          
          {/* Botones de configuración rápida */}
          <div className='p-3 bg-[#F9C81E]/10 border border-[#F9C81E]/20 rounded-lg'>
            <p className='text-xs text-[#F9C81E]/90 mb-2 font-medium flex items-center gap-1'>
              <Zap size={12} className='text-[#F9C81E]' />
              Configuración rápida:
            </p>
            <div className='flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => {
                  const quickSchedule = (formData.store?.schedule || []).map(day => ({
                    ...day,
                    isOpen: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].includes(day.day),
                    openTime: '09:00',
                    closeTime: '18:00'
                  }));
                  handleStoreInputChange('schedule', quickSchedule);
                }}
                className='px-3 py-1.5 text-xs bg-[#F9C81E]/20 hover:bg-[#F9C81E]/30 border border-[#F9C81E]/30 rounded text-[#F9C81E] hover:text-[#F9C81E]/80 transition-colors'
              >
                Lunes a Viernes 9:00-18:00
              </button>
              <button
                type='button'
                onClick={() => {
                  const quickSchedule = (formData.store?.schedule || []).map(day => ({
                    ...day,
                    isOpen: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].includes(day.day),
                    openTime: '08:00',
                    closeTime: '20:00'
                  }));
                  handleStoreInputChange('schedule', quickSchedule);
                }}
                className='px-3 py-1.5 text-xs bg-[#F9C81E]/20 hover:bg-[#F9C81E]/30 border border-[#F9C81E]/30 rounded text-[#F9C81E] hover:text-[#F9C81E]/80 transition-colors'
              >
                Lunes a Sábado 8:00-20:00
              </button>
              <button
                type='button'
                onClick={() => {
                  const quickSchedule = (formData.store?.schedule || []).map(day => ({
                    ...day,
                    isOpen: false,
                    openTime: '00:00',
                    closeTime: '00:00'
                  }));
                  handleStoreInputChange('schedule', quickSchedule);
                }}
                className='px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-300 hover:text-red-200 transition-colors'
              >
                Cerrar todos
              </button>
            </div>
          </div>
          
          {/* Horarios individuales */}
          <div className='space-y-3'>
            {(formData.store?.schedule || []).map((day, index) => (
              <div key={day.day} className='flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10'>
                <div className='flex items-center gap-3 min-w-[140px]'>
                  <input
                    type='checkbox'
                    checked={day.isOpen}
                    onChange={(e) => handleScheduleChange(index, 'isOpen', e.target.checked)}
                    className='w-5 h-5 text-[#F9C81E] bg-transparent border-2 border-[#F9C81E]/70 rounded focus:ring-[#F9C81E]/50 focus:ring-2'
                  />
                  <span className='text-sm text-white/90 font-medium'>{day.day}</span>
                </div>
                
                {day.isOpen ? (
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-white/70 font-medium'>Apertura:</span>
                      <input
                        type='time'
                        value={day.openTime}
                        onChange={(e) => handleScheduleChange(index, 'openTime', e.target.value)}
                        className='px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-white/70 font-medium'>Cierre:</span>
                      <input
                        type='time'
                        value={day.closeTime}
                        onChange={(e) => handleScheduleChange(index, 'closeTime', e.target.value)}
                        className='px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-[#F9C81E]/80 font-medium'>
                        {day.openTime} - {day.closeTime}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-white/50 italic'>Cerrado</span>
                    <div className='w-16 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center'>
                      <span className='text-xs text-white/30'>--:--</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className='space-y-4'>
          <Text variant='h3' size='lg' className='text-white/90 border-b border-white/20 pb-2'>
            Redes Sociales
          </Text>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                TikTok
              </label>
              <input
                type='url'
                value={formData.store?.socialMedia?.tiktok || ''}
                onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='https://www.tiktok.com/@tu_tienda'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Facebook
              </label>
              <input
                type='url'
                value={formData.store?.socialMedia?.facebook || ''}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='https://www.facebook.com/tu_tienda'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-white/90 mb-2'>
                Instagram
              </label>
              <input
                type='url'
                value={formData.store?.socialMedia?.instagram || ''}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                className='w-full p-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#F9C81E]/50 focus:ring-1 focus:ring-[#F9C81E]/50'
                placeholder='https://www.instagram.com/tu_tienda'
              />
            </div>
          </div>
          
          {/* Información sobre redes sociales */}
          <div className='p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg'>
            <p className='text-xs text-purple-300/90 mb-2 font-medium flex items-center gap-1'>
              <Smartphone size={12} className='text-purple-300' />
              Redes Sociales:
            </p>
            <ul className='text-xs text-purple-300/80 space-y-1'>
              <li>• Agrega los enlaces de tus redes sociales para conectar con tus clientes</li>
              <li>• Los clientes podrán seguirte directamente desde las cards de tienda</li>
              <li>• Puedes dejarlos vacíos si no tienes redes sociales</li>
              <li>• Asegúrate de que las URLs sean válidas (ej: https://www.tiktok.com/@tu_cuenta)</li>
            </ul>
          </div>
        </div>

        {/* Botones de acción */}
        <div className='flex justify-end gap-3 pt-6 border-t border-white/20'>
          <Button
            variant='minimal'
            onClick={onCancel}
            className='px-6 py-2 border border-white/20 text-white hover:bg-white/10'
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='success'
            className='px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center gap-2'
          >
            <Save size={18} />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoreForm; 