import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import productsData from '../../../data/admin/products.json';

const ProductTable = ({ products, onEdit, onDelete, onToggleStatus }) => {
  const [productsToDisplay, setProductsToDisplay] = useState([]);

  useEffect(() => {
    // Si no se pasan products como prop, usar los datos del JSON
    if (products && products.length > 0) {
      setProductsToDisplay(products);
    } else {
      setProductsToDisplay(productsData);
    }
  }, [products]);

  const getCategoryLabel = category => {
    const categories = {
      juguetes: 'Juguetes',
      ropa: 'Ropa',
      electronica: 'Electrónica',
      hogar: 'Hogar',
      deportes: 'Deportes',
    };
    return categories[category] || category;
  };

  const getStockStatus = stock => {
    if (stock === 0)
      return 'bg-red-500/20 text-red-300 border border-red-400/30';
    if (stock < 5)
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30';
    return 'bg-green-500/20 text-green-300 border border-green-400/30';
  };

  const getStockText = stock => {
    if (stock === 0) return 'Sin stock';
    if (stock < 5) return 'Stock bajo';
    return 'En stock';
  };

  return (
    <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden'>
      <div className='px-6 py-4 border-b border-white/20'>
        <Text variant='h3' size='lg' className='text-white'>
          <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
            Productos de la Tienda
          </span>
        </Text>
        <Text variant='bodyLight' size='sm' className='text-white/70 mt-1'>
          Gestiona el catálogo de productos
        </Text>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-white/5'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider'>
                Producto
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                Categoría
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                Precio
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                Stock
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider'>
                Nota del Admin
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                Estado
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white/5 divide-y divide-white/10'>
            {productsToDisplay.map(product => (
              <tr
                key={product.id}
                className='hover:bg-white/5 transition-colors duration-200'
              >
                <td className='px-6 py-4 whitespace-nowrap text-left'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-full flex items-center justify-center mr-3'>
                      <span className='text-xl'>{product.image}</span>
                    </div>
                    <div>
                      <Text
                        variant='body'
                        size='sm'
                        className='font-medium text-white'
                      >
                        {product.name}
                      </Text>
                      <Text
                        variant='bodyLight'
                        size='xs'
                        className='text-white/70'
                      >
                        {product.description}
                      </Text>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white/10 text-white/90 border border-white/20'>
                    {getCategoryLabel(product.category)}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <Text
                    variant='body'
                    size='sm'
                    className='font-medium text-white'
                  >
                    {product.price}
                  </Text>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <div className='flex items-center justify-center'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatus(product.stock)}`}
                    >
                      {getStockText(product.stock)}
                    </span>
                    <Text
                      variant='bodyLight'
                      size='xs'
                      className='text-white/70 ml-2'
                    >
                      ({product.stock})
                    </Text>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  {product.adminNote ? (
                    <div className='flex items-start gap-2'>
                      <div className='w-5 h-5 flex-shrink-0 mt-0.5'>
                        <div className='w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/30'>
                          <span className='text-orange-400 text-sm'>📝</span>
                        </div>
                      </div>
                      <p className='text-orange-300/90 text-sm italic'>
                        "{product.adminNote}"
                      </p>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2 text-white/30'>
                      <div className='w-5 h-5 bg-white/5 rounded-full flex items-center justify-center border border-white/10'>
                        <span className='text-white/30 text-xs'>-</span>
                      </div>
                      <span className='text-sm'>Sin nota</span>
                    </div>
                  )}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                        : 'bg-red-500/20 text-red-300 border border-red-400/30'
                    }`}
                  >
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-center'>
                  <div className='flex space-x-2 justify-center'>
                    <Button
                      variant='secondary'
                      size='sm'
                      onClick={() => onEdit(product)}
                      className='text-xs bg-white/10 hover:bg-white/20 border border-white/20'
                    >
                      Editar
                    </Button>
                    <Button
                      variant={product.isActive ? 'warning' : 'success'}
                      size='sm'
                      onClick={() => onToggleStatus(product.id)}
                      className={`text-xs ${
                        product.isActive
                          ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-400/30'
                          : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-400/30'
                      }`}
                    >
                      {product.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => onDelete(product.id)}
                      className='text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30'
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productsToDisplay.length === 0 && (
        <div className='text-center py-8'>
          <Text variant='bodyLight' size='md' className='text-white/70'>
            No hay productos registrados aún
          </Text>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
