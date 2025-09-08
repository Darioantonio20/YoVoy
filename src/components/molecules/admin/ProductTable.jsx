import React, { useState } from 'react';
import { Package } from 'lucide-react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import SearchBar from '../../atoms/SearchBar';

const ProductTable = ({ products, onEdit, onDelete, onDeleteProduct, isLoading }) => {

  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const productsToDisplay = products || [];

  // Filtrar productos basado en el término de búsqueda
  const filteredProducts = productsToDisplay.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    
    // Buscar por nombre del producto
    const productName = (product.name || '').toLowerCase();
    if (productName.includes(searchLower)) return true;
    
    // Buscar por descripción
    const description = (product.description || '').toLowerCase();
    if (description.includes(searchLower)) return true;
    
    // Buscar por categoría
    const category = (product.category || '').toLowerCase();
    if (category.includes(searchLower)) return true;
    
    // Buscar por precio
    const price = (product.price || 0).toString();
    if (price.includes(searchLower)) return true;
    
    // Buscar por stock
    const stock = (product.stock || 0).toString();
    if (stock.includes(searchLower)) return true;
    
    // Buscar por nota del admin
    const adminNote = (product.adminNote || '').toLowerCase();
    if (adminNote.includes(searchLower)) return true;
    
    return false;
  });

  const getCategoryLabel = category => {
    const categories = {
      tecnologia: 'tecnologia',
      moda: 'moda',
      juguetes: 'juguetes',
      comida: 'comida',
      hogar: 'hogar',
      jardin: 'jardin',
      mascotas: 'mascotas',
      deportes: 'deportes',
      belleza: 'belleza',
      libros: 'libros',
      musica: 'musica',
      arte: 'arte',
      automotriz: 'automotriz',
      ferreteria: 'ferreteria',
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

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setIsDeleting(true);
      setUpdatingProductId(productId);
      if (onDeleteProduct) {
        await onDeleteProduct(productId);
      }
      setUpdatingProductId(null);
      setIsDeleting(false);
      if (onDelete) {
        onDelete(productId);
      }
    }
  };

  const handleSearch = () => {
    // La búsqueda se actualiza automáticamente con el filtro
  };

  return (
    <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden'>
      <div className='px-6 py-4 border-b border-white/20'>
        <div className='flex items-center justify-between'>
          <div>
            <Text variant='h3' size='lg' className='text-white'>
              <span className='bg-gradient-to-r from-[#F9C81E] to-yellow-400 bg-clip-text text-transparent'>
                Productos de la Tienda
              </span>
            </Text>
            <Text variant='bodyLight' size='sm' className='text-white/70 mt-1'>
              Gestiona el catálogo de productos
            </Text>
          </div>
          {isLoading && (
            <div className='flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full'>
              <div className='w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin'></div>
              <Text variant='bodyLight' size='xs' className='text-blue-300'>
                Cargando...
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className='px-6 py-4 border-b border-white/10'>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Buscar por nombre, categoría, precio, stock...'
          onSearch={handleSearch}
          showSearchButton={false}
          className='mb-0'
        />
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
              <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                Nota del Admin
              </th>

              <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white/5 divide-y divide-white/10'>
            {isLoading ? (
              <tr>
                <td colSpan='6' className='px-6 py-8 text-center'>
                  <div className='flex items-center justify-center'>
                    <div className='w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                    <Text variant='body' size='base' className='text-white/70 ml-3'>
                      Cargando productos...
                    </Text>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr
                  key={product._id}
                  className={`hover:bg-white/5 transition-colors duration-200 ${
                    updatingProductId === product._id ? 'bg-blue-500/10 border-l-4 border-blue-400' : ''
                  }`}
                >
                <td className='px-6 py-4 whitespace-nowrap text-left'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-gradient-to-br from-[#F9C81E]/20 to-yellow-500/20 border border-[#F9C81E]/30 rounded-full flex items-center justify-center mr-3 overflow-hidden'>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Package size={20} className='text-white/70' style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }} />
                    </div>
                    <div>
                      <Text
                        variant='body'
                        size='sm'
                        className='font-medium text-white'
                      >
                        {product.name || 'Sin nombre'}
                      </Text>
                      <Text
                        variant='bodyLight'
                        size='xs'
                        className='text-white/70'
                      >
                        {product.description || 'Sin descripción'}
                      </Text>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-white/10 text-white/90 border border-white/20'>
                    {getCategoryLabel(product.category || 'sin-categoria')}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <Text
                    variant='body'
                    size='sm'
                    className='font-medium text-white'
                  >
                    ${(product.price || 0).toFixed(2)}
                  </Text>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  <div className='flex items-center justify-center'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatus(product.stock || 0)}`}
                    >
                      {getStockText(product.stock || 0)}
                    </span>
                    <Text
                      variant='bodyLight'
                      size='xs'
                      className='text-white/70 ml-2'
                    >
                      ({product.stock || 0})
                    </Text>
                  </div>
                </td>

                <td className='px-6 py-4 whitespace-nowrap text-center'>
                  {product.adminNote ? (
                    <div className='max-w-xs'>
                      <Text
                        variant='bodyLight'
                        size='xs'
                        className='text-white/70 bg-white/5 px-2 py-1 rounded border border-white/10'
                        title={product.adminNote || ''}
                      >
                        {(product.adminNote || '').length > 30 
                          ? `${(product.adminNote || '').substring(0, 30)}...` 
                          : (product.adminNote || '')
                        }
                      </Text>
                    </div>
                  ) : (
                    <Text
                      variant='bodyLight'
                      size='xs'
                      className='text-white/50 italic'
                    >
                      Sin nota
                    </Text>
                  )}
                </td>

                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-center'>
                  <div className='flex space-x-2 justify-center'>
                    <Button
                      variant='secondary'
                      size='sm'
                      onClick={() => onEdit(product)}
                      className='text-xs bg-white/10 hover:bg-white/20 border border-white/20'
                      disabled={updatingProductId === product._id}
                    >
                      {updatingProductId === product._id ? (
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin'></div>
                          <span>Actualizando...</span>
                        </div>
                      ) : (
                        'Editar'
                      )}
                    </Button>

                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => handleDelete(product._id)}
                      className='text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30'
                      disabled={isDeleting || updatingProductId === product._id}
                    >
                      {updatingProductId === product._id ? (
                        <div className='flex items-center gap-1'>
                          <div className='w-3 h-3 border border-red-300 border-t-transparent rounded-full animate-spin'></div>
                          <span>Eliminando...</span>
                        </div>
                      ) : (
                        'Eliminar'
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className='text-center py-8'>
          <Text variant='bodyLight' size='md' className='text-white/70'>
            {searchTerm ? `No se encontraron productos para "${searchTerm}"` : 'No hay productos registrados aún'}
          </Text>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
