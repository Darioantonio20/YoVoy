import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';

const ProductForm = ({ product, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '👧', // Emoji por defecto
    category: 'juguetes',
    stock: '',
    isActive: true,
    adminNote: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.replace('$', '') : '',
        image: product.image || '👧',
        category: product.category || 'juguetes',
        stock: product.stock || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        adminNote: product.adminNote || '',
      });
    }
  }, [product, isEditing]);

  const categories = [
    { value: 'juguetes', label: 'Juguetes' },
    { value: 'ropa', label: 'Ropa' },
    { value: 'electronica', label: 'Electrónica' },
    { value: 'hogar', label: 'Hogar' },
    { value: 'deportes', label: 'Deportes' },
  ];

  const emojis = ['👧', '🚗', '🧸', '🎮', '📱', '👕', '👟', '🏠', '⚽', '🎨'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser 0 o mayor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (validateForm()) {
      const productData = {
        ...formData,
        price: `$${parseFloat(formData.price).toFixed(2)}`,
        stock: parseInt(formData.stock),
        id: isEditing ? product.id : Date.now().toString(),
      };

      onSave(productData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6'>
      <div className='mb-6'>
        <Text variant='h3' size='lg' className='text-white'>
          <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </span>
        </Text>
        <Text variant='bodyLight' size='sm' className='text-white/70 mt-1'>
          {isEditing
            ? 'Modifica la información del producto'
            : 'Agrega un nuevo producto a tu tienda'}
        </Text>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Nombre del producto */}
        <div>
          <label className='block text-sm font-medium text-white/90 mb-2'>
            Nombre del Producto *
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white placeholder-white/50 ${
              errors.name ? 'border-red-400' : 'border-white/20'
            }`}
            placeholder='Ej: Muñeca Clásica'
          />
          {errors.name && (
            <Text variant='bodyLight' size='xs' className='text-red-400 mt-1'>
              {errors.name}
            </Text>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className='block text-sm font-medium text-white/90 mb-2'>
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white placeholder-white/50 ${
              errors.description ? 'border-red-400' : 'border-white/20'
            }`}
            placeholder='Describe el producto...'
          />
          {errors.description && (
            <Text variant='bodyLight' size='xs' className='text-red-400 mt-1'>
              {errors.description}
            </Text>
          )}
        </div>

        {/* Precio y Stock */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-white/90 mb-2'>
              Precio *
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-2 text-white/50'>$</span>
              <input
                type='number'
                step='0.01'
                min='0'
                value={formData.price}
                onChange={e => handleInputChange('price', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white placeholder-white/50 ${
                  errors.price ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder='0.00'
              />
            </div>
            {errors.price && (
              <Text variant='bodyLight' size='xs' className='text-red-400 mt-1'>
                {errors.price}
              </Text>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-white/90 mb-2'>
              Stock *
            </label>
            <input
              type='number'
              min='0'
              value={formData.stock}
              onChange={e => handleInputChange('stock', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white placeholder-white/50 ${
                errors.stock ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder='0'
            />
            {errors.stock && (
              <Text variant='bodyLight' size='xs' className='text-red-400 mt-1'>
                {errors.stock}
              </Text>
            )}
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className='block text-sm font-medium text-white/90 mb-2'>
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={e => handleInputChange('category', e.target.value)}
            className='w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white'
          >
            {categories.map(category => (
              <option
                key={category.value}
                value={category.value}
                className='bg-gray-800 text-white'
              >
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen (Emoji) */}
        <div>
          <label className='block text-sm font-medium text-white/90 mb-2'>
            Imagen (Emoji)
          </label>
          <div className='grid grid-cols-5 gap-2'>
            {emojis.map(emoji => (
              <button
                key={emoji}
                type='button'
                onClick={() => handleInputChange('image', emoji)}
                className={`w-12 h-12 text-2xl rounded-lg border-2 flex items-center justify-center transition-all ${
                  formData.image === emoji
                    ? 'border-orange-400 bg-orange-500/20'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Nota del Admin */}
        <div>
          <label className='block text-sm font-medium text-white/90 mb-2'>
            Nota del Admin
            <span className='text-white/50 ml-1'>(opcional)</span>
          </label>
          <textarea
            value={formData.adminNote}
            onChange={e => handleInputChange('adminNote', e.target.value)}
            rows={2}
            className='w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white placeholder-white/50'
            placeholder='Agrega una nota interna sobre el producto (ej: stock bajo, descuentos, etc.)'
          />
        </div>

        {/* Estado activo */}
        <div className='flex items-center'>
          <input
            type='checkbox'
            id='isActive'
            checked={formData.isActive}
            onChange={e => handleInputChange('isActive', e.target.checked)}
            className='h-4 w-4 text-orange-400 focus:ring-orange-400 border-white/30 rounded bg-white/5'
          />
          <label
            htmlFor='isActive'
            className='ml-2 block text-sm text-white/90'
          >
            Producto activo (disponible para venta)
          </label>
        </div>

        {/* Botones */}
        <div className='flex space-x-4 pt-4'>
          <Button
            type='submit'
            variant='success'
            className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
          >
            {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
          <Button
            type='button'
            variant='secondary'
            onClick={onCancel}
            className='flex-1 bg-white/10 hover:bg-white/20 border border-white/20'
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
