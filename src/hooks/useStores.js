import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_CONFIG } from '../config/api';

export const useStores = () => {
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado de paginación para productos
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10, // Cambiado de 20 a 10 productos por página
    total: 0,
    hasMore: true
  });

  // Obtener todas las tiendas
  const fetchStores = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir query parameters
      const params = new URLSearchParams();
      if (filters.categories) {
        params.append('categories', Array.isArray(filters.categories) ? filters.categories.join(',') : filters.categories);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.STORES.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiRequest(endpoint, {
        method: 'GET',
      });

      if (response.success) {
        setStores(response.data.data);
        return response.data;
      } else {
        setError(response.data.message || 'Error al cargar las tiendas');
        return null;
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError('Error de conexión al cargar las tiendas');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener tienda específica
  const fetchStore = useCallback(async (storeId) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = API_CONFIG.ENDPOINTS.STORES.DETAIL.replace(':storeId', storeId);
      const response = await apiRequest(endpoint, {
        method: 'GET',
      });

      if (response.success) {
        setCurrentStore(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || 'Error al cargar la tienda');
        return null;
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      setError('Error de conexión al cargar la tienda');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener productos de una tienda
  const fetchProducts = useCallback(async (storeId, filters = {}) => {
    const page = filters.page || 1;
    const limit = filters.limit || 10; // Cambiado de 20 a 10 productos por página
    
    setIsLoading(true);
    setError(null);

    try {
      // Construir query parameters
      const params = new URLSearchParams();
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      params.append('page', page);
      params.append('limit', limit);

      const endpoint = `${API_CONFIG.ENDPOINTS.STORES.PRODUCTS.LIST.replace(':storeId', storeId)}?${params.toString()}`;
      const response = await apiRequest(endpoint, {
        method: 'GET',
      });

      if (response.success) {
        const productsData = response.data.data || [];
        const paginationData = response.data.pagination || {};
        

        
        // Siempre reemplazar productos (no acumular)
        setProducts(productsData);
        
        // Actualizar estado de paginación
        setPagination(prev => ({
          page: paginationData.page || page,
          limit: paginationData.limit || limit,
          total: paginationData.total || prev.total,
          hasMore: productsData.length === limit && (paginationData.page || page) * (paginationData.limit || limit) < (paginationData.total || prev.total)
        }));
        
        return response.data;
      } else {
        setError(response.data.message || 'Error al cargar los productos');
        return null;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error de conexión al cargar los productos');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener producto específico
  const fetchProduct = useCallback(async (storeId, productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = API_CONFIG.ENDPOINTS.STORES.PRODUCTS.DETAIL
        .replace(':storeId', storeId)
        .replace(':productId', productId);
      
      const response = await apiRequest(endpoint, {
        method: 'GET',
      });

      if (response.success) {
        return response.data.data;
      } else {
        setError(response.data.message || 'Error al cargar el producto');
        return null;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Error de conexión al cargar el producto');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpiar estado
  const clearStores = useCallback(() => {
    setStores([]);
    setCurrentStore(null);
    setProducts([]);
    setError(null);
  }, []);

  // Establecer tienda actual
  const setCurrentStoreData = useCallback((store) => {
    setCurrentStore(store);
  }, []);

  // Cambiar página de productos
  const changePage = useCallback(async (newPage, storeId = null) => {
    const targetStoreId = storeId || currentStore?._id;
    if (!targetStoreId || newPage < 1) return;
    
    await fetchProducts(targetStoreId, { 
      page: newPage, 
      limit: pagination.limit 
    });
  }, [currentStore, pagination.limit, fetchProducts]);

  // Limpiar productos
  const clearProducts = useCallback(() => {
    setProducts([]);
    setError(null);
    setPagination({
      page: 1,
      limit: 10, // Cambiado de 20 a 10 productos por página
      total: 0,
      hasMore: true
    });
  }, []);

  return {
    stores,
    currentStore,
    products,
    isLoading,
    error,
    pagination,
    hasMoreProducts: pagination.hasMore,
    fetchStores,
    fetchStore,
    fetchProducts,
    fetchProduct,
    setCurrentStoreData,
    changePage,
    clearStores,
    clearProducts,
  };
}; 