import { useState, useEffect, useCallback } from 'react';
import { apiRequest, API_CONFIG, buildUrl } from '../config/api';
import Alert from '../components/atoms/Alert';

export const useStore = () => {
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Obtener datos de la tienda del propietario
  const fetchStoreData = useCallback(async () => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      setIsLoading(false);
      return;
    }

    // Debounce: evitar múltiples llamadas simultáneas
    const now = Date.now();
    if (now - lastFetchTime < 2000) { // 2 segundos de debounce para store
      return;
    }
    setLastFetchTime(now);

    try {
      const user = JSON.parse(userData);
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.OWNER, { ownerId: user._id });
      const response = await apiRequest(endpoint);

      if (response.success) {
        // Si la respuesta es un array, tomar el primer elemento
        const storeData = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        setStoreData(storeData);
      } else {
        Alert.error('Error', 'No se pudo cargar los datos de la tienda');
      }
    } catch (error) {
      console.error('Error fetching store data:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, [lastFetchTime]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!hasInitialized) {
      fetchStoreData();
      setHasInitialized(true);
    }
  }, [fetchStoreData, hasInitialized]);

  // Actualizar datos de la tienda
  const updateStoreData = useCallback(async (updatedData) => {
    if (!storeData?._id) {
      Alert.error('Error', 'No se pudo identificar la tienda');
      return;
    }

    setIsUpdating(true);
    try {
      const endpoint = buildUrl(API_CONFIG.ENDPOINTS.STORES.UPDATE, { storeId: storeData._id });
    const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });

      if (response.success) {
        setStoreData(response.data.data);
        Alert.success('¡Actualizado!', 'Los datos de la tienda se han actualizado correctamente');
        return { success: true };
      } else {
        Alert.error('Error de Actualización', response.data.message || 'No se pudo actualizar la tienda');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Error updating store data:', error);
      Alert.error('Error de Conexión', 'No se pudo conectar con el servidor');
      return { success: false, message: 'Error de conexión' };
    } finally {
      setIsUpdating(false);
    }
  }, [storeData?._id]);

  return {
    storeData,
    isLoading,
    isUpdating,
    fetchStoreData,
    updateStoreData,
  };
}; 