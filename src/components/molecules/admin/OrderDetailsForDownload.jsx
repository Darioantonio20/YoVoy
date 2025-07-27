import React from 'react';
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  Download,
} from 'lucide-react';
import Text from '../../atoms/Text';

const OrderDetailsForDownload = ({ order }) => {
  const getPaymentMethodIcon = method => {
    switch (method) {
      case 'efectivo':
        return '💵';
      case 'transferencia':
        return '🏦';
      case 'Tarjeta':
        return <CreditCard className='w-5 h-5' />;
      default:
        return '💳';
    }
  };

  const getPaymentMethodText = method => {
    switch (method) {
      case 'efectivo':
        return 'Efectivo';
      case 'transferencia':
        return 'Transferencia Bancaria';
      case 'Tarjeta':
        return 'Tarjeta de Crédito/Débito';
      default:
        return method;
    }
  };

  return (
    <div
      className='bg-white p-8 max-w-4xl mx-auto'
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Marco decorativo */}
      <div className='border-4 border-blue-600 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white'>
        {/* Header con logo */}
        <div className='text-center mb-8 pb-6 border-b-2 border-blue-200'>
          <div className='flex items-center justify-center space-x-3 mb-4'>
            <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center'>
              <span className='text-white text-xl'>🛒</span>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-blue-800'>Jasai</h1>
              <p className='text-blue-600 font-medium'>Detalles de la Orden</p>
            </div>
          </div>
          <div className='bg-green-100 rounded-lg p-3 inline-block'>
            <div className='flex items-center space-x-2'>
              <CheckCircle className='w-5 h-5 text-green-600' />
              <span className='text-green-800 font-semibold'>
                Orden Completada
              </span>
            </div>
          </div>
        </div>

        {/* Información de la orden */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Información del Cliente */}
          <div className='bg-blue-50 rounded-lg p-6 border border-blue-200'>
            <div className='flex items-center space-x-2 mb-4'>
              <User className='w-5 h-5 text-blue-600' />
              <h2 className='text-xl font-bold text-blue-800'>
                Información del Cliente
              </h2>
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-blue-700 font-medium text-sm'>
                  Nombre Completo
                </p>
                <p className='text-blue-900 font-semibold'>{order.customer}</p>
              </div>

              <div>
                <p className='text-blue-700 font-medium text-sm'>
                  Correo Electrónico
                </p>
                <p className='text-blue-900 font-semibold'>{order.email}</p>
              </div>

              <div>
                <p className='text-blue-700 font-medium text-sm'>
                  Número Telefónico
                </p>
                <p className='text-blue-900 font-semibold'>
                  {order.phone || 'No especificado'}
                </p>
              </div>

              <div>
                <p className='text-blue-700 font-medium text-sm'>
                  Ubicación para Envío
                </p>
                <p className='text-blue-900 font-semibold'>
                  {order.shippingAddress || 'No especificada'}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Pago */}
          <div className='bg-green-50 rounded-lg p-6 border border-green-200'>
            <div className='flex items-center space-x-2 mb-4'>
              <div className='w-5 h-5 flex items-center justify-center'>
                {getPaymentMethodIcon(order.paymentMethod)}
              </div>
              <h2 className='text-xl font-bold text-green-800'>
                Información de Pago
              </h2>
            </div>

            <div className='space-y-3'>
              <div>
                <p className='text-green-700 font-medium text-sm'>
                  Método de Pago
                </p>
                <p className='text-green-900 font-semibold'>
                  {getPaymentMethodText(order.paymentMethod)}
                </p>
              </div>

              {order.paymentDetails && (
                <div>
                  <p className='text-green-700 font-medium text-sm'>
                    Detalles de Pago
                  </p>
                  <p className='text-green-900 font-semibold'>
                    {order.paymentDetails}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className='bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>
            Productos Ordenados
          </h2>

          <div className='space-y-3'>
            {order.products.map((product, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center'>
                    <span className='text-sm'>📦</span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      {product.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Cantidad: {product.quantity}
                    </p>
                  </div>
                </div>
                <p className='font-bold text-gray-900'>
                  ${(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Costos */}
        <div className='bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>
            Resumen de Costos
          </h2>

          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Subtotal:</span>
              <span className='font-semibold'>
                ${order.subtotal?.toFixed(2) || (order.total - 9.99).toFixed(2)}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-gray-600'>Envío:</span>
              <span className='font-semibold'>
                ${order.shipping?.toFixed(2) || '9.99'}
              </span>
            </div>

            <div className='border-t pt-3'>
              <div className='flex justify-between'>
                <span className='text-xl font-bold text-gray-900'>Total:</span>
                <span className='text-xl font-bold text-blue-600'>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información para el repartidor */}
        <div className='bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300'>
          <div className='flex items-center space-x-2 mb-4'>
            <span className='text-yellow-600 text-2xl'>🚚</span>
            <h2 className='text-xl font-bold text-yellow-800'>
              Información para el Repartidor
            </h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-yellow-700 font-medium text-sm'>Cliente:</p>
              <p className='text-yellow-900 font-bold'>{order.customer}</p>
            </div>
            <div>
              <p className='text-yellow-700 font-medium text-sm'>Teléfono:</p>
              <p className='text-yellow-900 font-bold'>
                {order.phone || 'No especificado'}
              </p>
            </div>
            <div className='md:col-span-2'>
              <p className='text-yellow-700 font-medium text-sm'>
                Dirección de Entrega:
              </p>
              <p className='text-yellow-900 font-bold'>
                {order.shippingAddress || 'No especificada'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 pt-6 border-t-2 border-blue-200 text-center'>
          <p className='text-gray-600 text-sm'>
            Orden #{order.id} - Generada el{' '}
            {new Date(order.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className='text-blue-600 font-medium mt-2'>
            Jasai - Tu tienda de confianza
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsForDownload;
