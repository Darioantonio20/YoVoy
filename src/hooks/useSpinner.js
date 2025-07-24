import { useState, useEffect } from "react";

const useSpinner = (minLoadTime = 1000) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // El Spinner aparece inmediatamente (isLoading = true por defecto)
    // Se oculta después del tiempo mínimo especificado
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  const setLoading = (loading) => {
    setIsLoading(loading);
  };

  return {
    isLoading,
    setLoading
  };
};

export default useSpinner; 