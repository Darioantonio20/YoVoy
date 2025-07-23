import { memo, useEffect } from "react";

const Alert = memo(({ open, onClose, children, type = "success", autoClose = false, autoCloseDelay = 5000 }) => {
  // Auto-close functionality
  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [open, autoClose, autoCloseDelay, onClose]);

  if (!open) return null;

  const alertStyles = {
    success: "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-800",
    error: "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800",
    warning: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 text-yellow-800",
    info: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 text-blue-800"
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ"
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4 animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className={`${alertStyles[type]} rounded-lg shadow-xl p-6 max-w-md w-full relative transform transition-all duration-300 scale-100 animate-slide-up`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold" aria-hidden="true">{icons[type]}</span>
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium">
              {children}
            </div>
          </div>
          <button 
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full w-6 h-6 flex items-center justify-center" 
            onClick={onClose}
            aria-label="Cerrar alerta"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';

export default Alert; 