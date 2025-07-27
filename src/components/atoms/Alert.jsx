import Swal from 'sweetalert2';

const Alert = {
  // Alerta de éxito
  success: (
    title = '¡Éxito!',
    message = 'Operación completada exitosamente'
  ) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#10b981',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        title: 'dark-title',
        content: 'dark-content',
        confirmButton: 'dark-confirm-button',
      },
    });
  },

  // Alerta de error
  error: (title = 'Error', message = 'Ha ocurrido un error') => {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#ef4444',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        title: 'dark-title',
        content: 'dark-content',
        confirmButton: 'dark-confirm-button',
      },
    });
  },

  // Alerta de confirmación
  confirm: (
    title = 'Confirmar',
    message = '¿Estás seguro de realizar esta acción?'
  ) => {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        title: 'dark-title',
        content: 'dark-content',
        confirmButton: 'dark-confirm-button',
        cancelButton: 'dark-cancel-button',
      },
    });
  },

  // Alerta de información
  info: (title = 'Información', message = 'Información importante') => {
    return Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3b82f6',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        title: 'dark-title',
        content: 'dark-content',
        confirmButton: 'dark-confirm-button',
      },
    });
  },

  // Alerta de advertencia
  warning: (title = 'Advertencia', message = 'Ten cuidado con esta acción') => {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#f59e0b',
      background: '#1f2937',
      color: '#ffffff',
      customClass: {
        popup: 'dark-popup',
        title: 'dark-title',
        content: 'dark-content',
        confirmButton: 'dark-confirm-button',
      },
    });
  },
};

export default Alert;
