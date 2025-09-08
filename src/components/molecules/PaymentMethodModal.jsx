import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import Button from '../atoms/Button';

const PaymentMethodModal = ({ isOpen, onClose, onConfirm, orderDetails }) => {
  const [selectedMethod, setSelectedMethod] = useState('efectivo');

  if (!isOpen) return null;

  const { subtotal, shipping, total } = orderDetails;

  const paymentMethods = [
    {
      id: 'efectivo',
      name: 'Efectivo',
      icon: (
        <div className='w-6 h-6 flex items-center justify-center text-green-600 text-xl'>
          💵
        </div>
      ),
      description: 'Pago en efectivo al momento de la entrega',
    },
    {
      id: 'transferencia',
      name: 'Transferencia Bancaria',
      icon: (
        <div className='w-6 h-6 flex items-center justify-center text-blue-600 text-xl'>
          🏦
        </div>
      ),
      description: 'Transferencia a cuenta bancaria',
    },
  ];

  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <button
            onClick={onClose}
            className='flex items-center space-x-2 text-white/70 hover:text-white transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            <span>Volver</span>
          </button>
          <button
            onClick={onClose}
            className='text-white/60 hover:text-white transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Título */}
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-white mb-2'>Método de Pago</h2>
          <p className='text-white/70'>
            Selecciona tu método de pago preferido
          </p>
        </div>

        {/* Métodos de pago */}
        <div className='space-y-4 mb-6'>
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-[#F9C81E] bg-[#F9C81E]/10'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className='flex items-center space-x-4'>
                <div
                  className={`p-2 rounded-lg ${
                    selectedMethod === method.id
                      ? 'bg-[#F9C81E]/20'
                      : 'bg-white/10'
                  }`}
                >
                  {method.icon}
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold text-white'>{method.name}</h3>
                  <p className='text-sm text-white/70'>{method.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-[#F9C81E] bg-[#F9C81E]'
                      : 'border-white/40'
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className='w-full h-full rounded-full bg-white scale-75'></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de la orden */}
        <div className='bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/10'>
          <h3 className='font-semibold text-white mb-3'>Resumen de la orden</h3>
          <div className='space-y-2'>
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
            <div className='flex justify-between text-lg font-bold text-[#F9C81E] border-t border-white/20 pt-2'>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className='flex flex-col sm:flex-row gap-3 sm:space-x-4'>
          <Button variant='success' onClick={handleConfirm} className='w-full order-1 sm:order-2 py-3'>
            Confirmar Pago
          </Button>
          <Button variant='secondary' onClick={onClose} className='w-full order-2 sm:order-1'>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
