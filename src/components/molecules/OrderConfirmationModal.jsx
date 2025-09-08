import React from 'react';
import { CheckCircle, ArrowLeft, ShoppingBag, FileText } from 'lucide-react';
import Button from '../atoms/Button';

const OrderConfirmationModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen || !orderDetails) return null;

  const { items = [], subtotal = 0, shipping = 0, total = 0 } = orderDetails;

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl'>
        {/* Header con botón back */}
        <div className='flex items-center justify-between mb-6'>
          <button
            onClick={onClose}
            className='flex items-center space-x-2 text-white/70 hover:text-white transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            <span>Volver</span>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className='text-center'>
          {/* Icono de éxito */}
          <div className='w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-green-500/30'>
            <CheckCircle className='w-8 h-8 sm:w-10 sm:h-10 text-green-400' />
          </div>

          {/* Título */}
          <h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
            ¡Orden Confirmada!
          </h2>
          <p className='text-sm sm:text-base text-white/70 mb-6 sm:mb-8'>
            Tu pedido ha sido procesado exitosamente
          </p>

          {/* Detalles de la orden */}
          <div className='bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-white/10'>
            <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>
              Detalles de tu orden
            </h3>

            {/* Productos */}
            <div className='space-y-3 mb-4 sm:mb-6'>
              {items && items.length > 0 ? items.map((item, index) => (
                <div
                  key={item.productId || item.id || index}
                  className='flex justify-between items-center'
                >
                  <div className='flex items-center space-x-2 sm:space-x-3'>
                                  <div className='w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center'>
                <ShoppingBag size={20} className='text-white' />
              </div>
                    <div className='text-left'>
                      <p className='text-sm sm:text-base font-medium text-white'>{item.name}</p>
                      <p className='text-xs sm:text-sm text-white/70'>
                        Cantidad: {item.quantity}
                      </p>
                      {item.note && (
                        <p className='text-xs sm:text-sm text-[#F9C81E]/80 italic mt-1'>
                          Nota: {item.note}
                        </p>
                      )}
                      {item.adminNote && (
                        <div className='mt-1 p-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs'>
                          <div className='flex items-center gap-1 mb-1'>
                            <FileText size={10} className='text-yellow-400' />
                            <span className='text-yellow-300 font-medium'>Nota del vendedor:</span>
                          </div>
                          <p className='text-yellow-200 leading-relaxed'>
                            {item.adminNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className='text-sm sm:text-base font-semibold text-white'>
                    ${((typeof item.price === 'number' ? item.price : parseFloat(item.price?.replace('$', '').replace(',', '') || '0')) * item.quantity).toFixed(2)}
                  </p>
                </div>
              )) : (
                <div className='text-center py-4'>
                  <p className='text-gray-400'>No hay productos en la orden</p>
                </div>
              )}
            </div>

            {/* Resumen de costos */}
            <div className='border-t border-white/20 pt-3 sm:pt-4 space-y-2'>
              <div className='flex justify-between text-sm sm:text-base'>
                <span className='text-white/70'>Subtotal:</span>
                <span className='font-medium text-white'>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between text-sm sm:text-base'>
                <span className='text-white/70'>Envío:</span>
                <span className='font-medium text-white'>
                  ${shipping.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between text-base sm:text-lg font-bold text-[#F9C81E] border-t border-white/20 pt-2'>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {/* Botón */}
          <Button variant='success' onClick={onClose} className='w-full'>
            Confirmar compra
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
