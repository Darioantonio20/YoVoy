import { useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (onLoadMore, hasMore, isLoading) => {
  const observerRef = useRef();
  const lastElementRef = useCallback(node => {
    if (isLoading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [onLoadMore, hasMore, isLoading]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
}; 