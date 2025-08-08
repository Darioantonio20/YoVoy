import { memo } from 'react';
import { Package } from 'lucide-react';
import ProductCard from '../molecules/ProductCard';
import Text from '../atoms/Text';
import Pagination from '../atoms/Pagination';

const ProductGrid = memo(({ 
  products, 
  onAddToCart, 
  pagination = null,
  onPageChange,
  isLoading = false
}) => {
  return (
    <div className='space-y-6'>
      {/* Grid de productos */}
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8'>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {products.length === 0 && !isLoading && (
        <div className='text-center py-12'>
          <div className='w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center'>
            <Package size={48} className='text-white/70' />
          </div>
          <Text className='text-white/70 text-lg mb-2'>
            No se encontraron productos
          </Text>
          <Text className='text-white/50 text-sm'>
            Intenta con otros filtros de búsqueda
          </Text>
        </div>
      )}

      {/* Indicador de carga */}
      {isLoading && (
        <div className='text-center py-8'>
          <div className='inline-flex items-center gap-3'>
            <div className='w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
            <Text className='text-white/70 text-sm'>Cargando productos...</Text>
          </div>
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.total > 0 && (
        <div className='mt-8'>
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.limit)}
            onPageChange={onPageChange}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
