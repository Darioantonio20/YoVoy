import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';

const ProductForm = ({ product, onSave, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'tecnologia',
    stock: '',
    images: [],
    adminNote: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString() : '',
        category: product.category || 'tecnologia',
        stock: product.stock ? product.stock.toString() : '',
        images: product.images || [],
        adminNote: product.adminNote || '',
      });
    }
  }, [product, isEditing]);

  const categories = [
    { value: 'tecnologia', label: 'tecnologia' },
    { value: 'moda', label: 'moda' },
    { value: 'juguetes', label: 'juguetes' },
    { value: 'comida', label: 'comida' },
    { value: 'hogar', label: 'hogar' },
    { value: 'jardin', label: 'jardin' },
    { value: 'mascotas', label: 'mascotas' },
    { value: 'deportes', label: 'deportes' },
    { value: 'belleza', label: 'belleza' },
    { value: 'libros', label: 'libros' },
    { value: 'musica', label: 'musica' },
    { value: 'arte', label: 'arte' },
    { value: 'automotriz', label: 'automotriz' },
    { value: 'ferreteria', label: 'ferreteria' },
  ];

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

  const handleSubmit = async e => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        images: formData.images,
        adminNote: formData.adminNote.trim(),
      };

      try {
        await onSave(productData);
      } finally {
        setIsSubmitting(false);
      }
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

        {/* Imágenes */}
        <div>
          <label className='block text-sm font-medium text-white/90 mb-2'>
            Imágenes del Producto
          </label>
          <textarea
            value={formData.images.join(', ')}
            onChange={e => handleInputChange('images', e.target.value.split(', ').filter(url => url.trim()))}
            rows='3'
            className='w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white placeholder-white/50 resize-none'
            placeholder='URLs de imágenes separadas por comas (ej: https://i.ibb.co/xxx/producto1.jpg, https://i.ibb.co/yyy/producto2.jpg)'
          />
          <p className='text-xs text-white/50 mt-1'>
            💡 Sube tus imágenes en <a href='https://es.imgbb.com/' target='_blank' rel='noopener noreferrer' className='text-orange-400 hover:text-orange-300 underline'>ImgBB.com</a> y pega las URLs aquí
          </p>
        </div>

        {/* Nota del Admin */}
        <div>
          <label className='block text-sm font-medium text-white/90 mb-2'>
            Nota del Admin
            <span className='text-white/50 ml-1'>(opcional, máximo 200 caracteres)</span>
          </label>
          <textarea
            value={formData.adminNote}
            onChange={e => handleInputChange('adminNote', e.target.value)}
            rows={2}
            maxLength={200}
            className='w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/5 text-white placeholder-white/50'
            placeholder='Agrega una nota interna sobre el producto (ej: stock bajo, descuentos, etc.)'
          />
          <div className='flex justify-between items-center mt-1'>
            <Text variant='bodyLight' size='xs' className='text-white/50'>
              💡 Esta nota será visible para los clientes
            </Text>
            <Text variant='bodyLight' size='xs' className='text-white/50'>
              {formData.adminNote.length}/200
            </Text>
          </div>
        </div>



        {/* Botones */}
        <div className='flex space-x-4 pt-4'>
          <Button
            type='submit'
            variant='success'
            disabled={isSubmitting}
            className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
              </div>
            ) : (
              isEditing ? 'Actualizar Producto' : 'Crear Producto'
            )}
          </Button>
          <Button
            type='button'
            variant='secondary'
            onClick={onCancel}
            disabled={isSubmitting}
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
