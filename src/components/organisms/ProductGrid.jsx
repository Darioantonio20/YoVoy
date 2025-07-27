import { memo } from 'react';
import ProductCard from '../molecules/ProductCard';

const ProductGrid = memo(({ products, onAddToCart }) => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12'>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
