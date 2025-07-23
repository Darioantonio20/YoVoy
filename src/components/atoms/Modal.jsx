import { memo, useEffect } from "react";

const Modal = memo(({ open, onClose, children, title }) => {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-[600px] w-full relative transform transition-all duration-300 scale-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full w-8 h-8 flex items-center justify-center" 
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </button>
        {title && (
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800 mb-6 pr-8">{title}</h2>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal; 