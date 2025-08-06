import Button from './Button';
import Text from './Text';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems,
  itemsPerPage = 10,
  isLoading = false 
}) => {
  // Calcular información de paginación
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Generar array de páginas a mostrar (máximo 7 páginas)
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Si hay 7 páginas o menos, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Si hay más de 7 páginas, mostrar páginas estratégicas
      if (currentPage <= 4) {
        // Páginas iniciales: 1, 2, 3, 4, 5, 6, 7, ..., totalPages
        for (let i = 1; i <= 6; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Páginas finales: 1, ..., totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 5; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas intermedias: 1, ..., currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2, ..., totalPages
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 2);
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(currentPage + 2);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Información de productos mostrados */}
      <div className="text-center">
        <Text className="text-white/70 text-sm">
          Mostrando {startItem}-{endItem} de {totalItems} productos
        </Text>
      </div>

      {/* Solo números de página */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-white/50">...</span>
            ) : (
              <Button
                variant={page === currentPage ? "fire" : "minimal"}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`px-3 py-2 min-w-[40px] ${
                  page === currentPage 
                    ? 'bg-orange-500 text-white' 
                    : 'text-white/70 hover:text-orange-400'
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pagination; 