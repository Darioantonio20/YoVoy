import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../atoms/Button';

const OrderConfirmationModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  const { items, subtotal, shipping, total } = orderDetails;

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
          <div className='w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30'>
            <CheckCircle className='w-10 h-10 text-green-400' />
          </div>

          {/* Título */}
          <h2 className='text-2xl font-bold text-white mb-2'>
            ¡Orden Confirmada!
          </h2>
          <p className='text-white/70 mb-8'>
            Tu pedido ha sido procesado exitosamente
          </p>

          {/* Detalles de la orden */}
          <div className='bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/10'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Detalles de tu orden
            </h3>

            {/* Productos */}
            <div className='space-y-3 mb-6'>
              {items.map(item => (
                <div
                  key={item.id}
                  className='flex justify-between items-center'
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>{item.image}</span>
                    <div className='text-left'>
                      <p className='font-medium text-white'>{item.name}</p>
                      <p className='text-sm text-white/70'>
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className='font-semibold text-white'>
                    $
                    {(
                      parseFloat(item.price.replace('$', '').replace(',', '')) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Resumen de costos */}
            <div className='border-t border-white/20 pt-4 space-y-2'>
              <div className='flex justify-between'>
                <span className='text-white/70'>Subtotal:</span>
                <span className='font-medium text-white'>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Envío:</span>
                <span className='font-medium text-white'>
                  ${shipping.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between text-lg font-bold text-orange-400 border-t border-white/20 pt-2'>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Número de orden */}
          <div className='bg-orange-500/10 rounded-lg p-4 mb-6 border border-orange-500/20'>
            <p className='text-sm text-white/70'>Número de orden:</p>
            <p className='text-lg font-bold text-orange-400'>
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
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
