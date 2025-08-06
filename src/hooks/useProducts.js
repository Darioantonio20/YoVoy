import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_CONFIG, buildUrl } from '../config/api';
import Alert from '../components/atoms/Alert';

export const useProducts = (storeId) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Estado de paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20, // Cargar 20 productos por página
    total: 0,
    hasMore: true
  });

  // Obtener productos de la tienda con paginación
  const fetchProducts = useCallback(async (page = 1, limit = 20, retryCount = 0) => {
    if (!storeId) {
      setIsLoading(false);
      return;
    }

    // Verificar que el token esté disponible
    const token = localStorage.getItem('authToken');
    if (!token) {
      Alert.error('Error de Autenticación', 'No se encontró el token de autenticación');
      setIsLoading(false);
      return;
    }

    // Debounce: evitar múltiples llamadas simultáneas
    const now = Date.now();
    if (now - lastFetchTime < 1000) { // 1 segundo de debounce
      return;
    }
    setLastFetchTime(now);

    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS.LIST, { storeId });
      const response = await apiRequest(`${endpoint}?page=${page}&limit=${limit}`);

      if (response.success) {
        const productsData = Array.isArray(response.data.data) ? response.data.data : [];
        const paginationData = response.data.pagination || {};
        
        // Si es la primera página, reemplazar productos
        if (page === 1) {
          setProducts(productsData);
        } else {
          // Si es una página posterior, agregar productos
          setProducts(prevProducts => [...prevProducts, ...productsData]);
        }
        
        // Actualizar estado de paginación
        setPagination(prev => ({
          page: paginationData.page || page,
          limit: paginationData.limit || limit,
          total: paginationData.total || prev.total,
          hasMore: productsData.length === limit && (paginationData.page || page) * (paginationData.limit || limit) < (paginationData.total || prev.total)
        }));
      } else if (response.status === 429 && retryCount < 3) {
        // Retry después de un delay exponencial
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => fetchProducts(page, limit, retryCount + 1), delay);
      } else {
        Alert.error('Error', response.data?.message || 'No se pudieron cargar los productos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [storeId, lastFetchTime]);

  // Cargar más productos (página siguiente)
  const loadMoreProducts = useCallback(async () => {
    if (!pagination.hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      await fetchProducts(nextPage, pagination.limit);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pagination, fetchProducts, isLoadingMore]);

  // Cargar productos iniciales
  useEffect(() => {
    if (storeId) {
      // Resetear paginación al cambiar de tienda
      setPagination({
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true
      });
      setProducts([]);
      fetchProducts(1, 20);
    }
  }, [storeId, fetchProducts]);

  // Crear producto
  const createProduct = useCallback(async (productData) => {
    if (!storeId) {
      Alert.error('Error', 'No se pudo identificar la tienda');
      return { success: false };
    }

    // Verificar que el token esté disponible
    const token = localStorage.getItem('authToken');
    if (!token) {
      Alert.error('Error de Autenticación', 'No se encontró el token de autenticación');
      return { success: false };
    }

    setIsCreating(true);
    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, { storeId });
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      if (response.success) {
        Alert.success('¡Producto Creado!', 'El producto se ha creado correctamente');
        
        // Agregar el nuevo producto al estado local
        const newProduct = {
          ...productData,
          _id: response.data.data._id || `temp_${Date.now()}`, // Fallback si no hay ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active', // Estado por defecto
        };
        
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        
        // Actualizar total en paginación
        setPagination(prev => ({
          ...prev,
          total: prev.total + 1
        }));
        
        return { success: true };
      } else {
        Alert.error('Error de Creación', response.data?.message || 'No se pudo crear el producto');
        return { success: false, message: response.data?.message };
      }
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setIsCreating(false);
    }
  }, [storeId]);

  // Actualizar producto
  const updateProduct = useCallback(async (productId, productData) => {
    if (!storeId || !productId) {
      Alert.error('Error', 'No se pudo identificar la tienda o el producto');
      return { success: false };
    }

    // Verificar que el token esté disponible
    const token = localStorage.getItem('authToken');
    if (!token) {
      Alert.error('Error de Autenticación', 'No se encontró el token de autenticación');
      return { success: false };
    }

    setIsUpdating(true);
    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE, { storeId, productId });

      const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });

      if (response.success) {
        Alert.success('¡Producto Actualizado!', 'El producto se ha actualizado correctamente');
        
        // Actualizar inmediatamente el producto en el estado local
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product._id === productId 
              ? { ...product, ...productData, _id: productId, updatedAt: new Date().toISOString() }
              : product
          )
        );
        
        return { success: true };
      } else {
        Alert.error('Error de Actualización', response.data?.message || 'No se pudo actualizar el producto');
        return { success: false, message: response.data?.message };
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setIsUpdating(false);
    }
  }, [storeId]);

  // Eliminar producto
  const deleteProduct = useCallback(async (productId) => {
    if (!storeId || !productId) {
      Alert.error('Error', 'No se pudo identificar la tienda o el producto');
      return { success: false };
    }

    // Verificar que el token esté disponible
    const token = localStorage.getItem('authToken');
    if (!token) {
      Alert.error('Error de Autenticación', 'No se encontró el token de autenticación');
      return { success: false };
    }

    setIsDeleting(true);
    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE, { storeId, productId });

      const response = await apiRequest(endpoint, {
        method: 'DELETE',
      });

      if (response.success) {
        Alert.success('¡Producto Eliminado!', 'El producto se ha eliminado correctamente');
        
        // Remover el producto del estado local inmediatamente
        setProducts(prevProducts => 
          prevProducts.filter(product => product._id !== productId)
        );
        
        // Actualizar total en paginación
        setPagination(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1)
        }));
        
        return { success: true };
      } else {
        Alert.error('Error de Eliminación', response.data?.message || 'No se pudo eliminar el producto');
        return { success: false, message: response.data?.message };
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setIsDeleting(false);
    }
  }, [storeId]);

  return {
    products,
    isLoading,
    isLoadingMore,
    isCreating,
    isUpdating,
    isDeleting,
    pagination,
    hasMoreProducts: pagination.hasMore,
    fetchProducts,
    loadMoreProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}; 