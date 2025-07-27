import React, { useRef, useState } from 'react';
import { X, User, CreditCard, CheckCircle, Download } from 'lucide-react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import html2canvas from 'html2canvas';
import OrderDownloadTemplate from '../../atoms/admin/OrderDownloadTemplate';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const modalRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !order) return null;

  const handleDownloadImage = async () => {
    setIsDownloading(true);

    try {
      // Crear un elemento temporal para la captura
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = '#1f2937';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempDiv);

      // Usar el componente OrderDownloadTemplate
      const content = OrderDownloadTemplate({ order, getPaymentMethodText });
      tempDiv.innerHTML = content;

      // Esperar un poco para que se renderice
      await new Promise(resolve => setTimeout(resolve, 100));

      // Configuración para html2canvas
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#1f2937',
        scale: 2, // Mejor calidad
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Crear el enlace de descarga
      const link = document.createElement('a');
      link.download = `orden-${order.id}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Limpiar
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error al generar la imagen:', error);
      alert('Error al generar la imagen. Inténtalo de nuevo.');
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div
        className='bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10'
        ref={modalRef}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-6 h-6 text-orange-400' />
            </div>
            <div>
              <Text variant='h2' size='xl' className='text-white'>
                <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                  Detalles de la Orden
                </span>
              </Text>
              <Text variant='bodyLight' size='sm' className='text-white/70'>
                {order.id} - {getPaymentMethodText(order.paymentMethod)}
              </Text>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <button
              onClick={onClose}
              className='text-white/70 hover:text-white transition-colors'
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Información del Cliente */}
          <div className='space-y-6'>
            <div className='bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10'>
              <div className='flex items-center space-x-2 mb-4'>
                <User className='w-5 h-5 text-orange-400' />
                <Text variant='h3' size='lg' className='text-white'>
                  <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                    Información del Cliente
                  </span>
                </Text>
              </div>

              <div className='space-y-4'>
                <div>
                  <Text variant='bodyLight' size='sm' className='text-white/70'>
                    Nombre Completo
                  </Text>
                  <Text
                    variant='body'
                    size='md'
                    className='font-medium text-white'
                  >
                    {order.customer}
                  </Text>
                </div>

                <div>
                  <Text variant='bodyLight' size='sm' className='text-white/70'>
                    Correo Electrónico
                  </Text>
                  <Text
                    variant='body'
                    size='md'
                    className='font-medium text-white'
                  >
                    {order.email}
                  </Text>
                </div>

                <div>
                  <Text variant='bodyLight' size='sm' className='text-white/70'>
                    Número Telefónico
                  </Text>
                  <Text
                    variant='body'
                    size='md'
                    className='font-medium text-white'
                  >
                    {order.phone || 'No especificado'}
                  </Text>
                </div>

                <div>
                  <Text variant='bodyLight' size='sm' className='text-white/70'>
                    Ubicación para Envío
                  </Text>
                  <Text
                    variant='body'
                    size='md'
                    className='font-medium text-white'
                  >
                    {order.shippingAddress || 'No especificada'}
                  </Text>
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className='bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10'>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-5 h-5 flex items-center justify-center text-orange-400'>
                  {getPaymentMethodIcon(order.paymentMethod)}
                </div>
                <Text variant='h3' size='lg' className='text-white'>
                  <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                    Información de Pago
                  </span>
                </Text>
              </div>

              <div className='space-y-3'>
                <div>
                  <Text variant='bodyLight' size='sm' className='text-white/70'>
                    Método de Pago
                  </Text>
                  <Text
                    variant='body'
                    size='md'
                    className='font-medium text-white'
                  >
                    {getPaymentMethodText(order.paymentMethod)}
                  </Text>
                </div>

                {order.paymentDetails && (
                  <div>
                    <Text
                      variant='bodyLight'
                      size='sm'
                      className='text-white/70'
                    >
                      Detalles de Pago
                    </Text>
                    <Text
                      variant='body'
                      size='md'
                      className='font-medium text-white'
                    >
                      {order.paymentDetails}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Productos y Resumen */}
          <div className='space-y-6'>
            {/* Productos */}
            <div className='bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10'>
              <Text variant='h3' size='lg' className='text-white mb-4'>
                <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                  Productos Ordenados
                </span>
              </Text>

              <div className='space-y-3'>
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-400/30 rounded-full flex items-center justify-center'>
                        <span className='text-sm'>📦</span>
                      </div>
                      <div>
                        <Text
                          variant='body'
                          size='sm'
                          className='font-medium text-white'
                        >
                          {product.name}
                        </Text>
                        <Text
                          variant='bodyLight'
                          size='xs'
                          className='text-white/70'
                        >
                          Cantidad: {product.quantity}
                        </Text>
                      </div>
                    </div>
                    <Text
                      variant='body'
                      size='sm'
                      className='font-medium text-white'
                    >
                      ${(product.price * product.quantity).toFixed(2)}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Costos */}
            <div className='bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10'>
              <Text variant='h3' size='lg' className='text-white mb-4'>
                <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                  Resumen de Costos
                </span>
              </Text>

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <Text variant='body' size='sm' className='text-white/70'>
                    Subtotal:
                  </Text>
                  <Text
                    variant='body'
                    size='sm'
                    className='font-medium text-white'
                  >
                    $
                    {order.subtotal?.toFixed(2) ||
                      (order.total - 9.99).toFixed(2)}
                  </Text>
                </div>

                <div className='flex justify-between'>
                  <Text variant='body' size='sm' className='text-white/70'>
                    Envío:
                  </Text>
                  <Text
                    variant='body'
                    size='sm'
                    className='font-medium text-white'
                  >
                    ${order.shipping?.toFixed(2) || '9.99'}
                  </Text>
                </div>

                <div className='border-t border-white/20 pt-3'>
                  <div className='flex justify-between'>
                    <Text
                      variant='body'
                      size='lg'
                      className='font-bold text-white'
                    >
                      Total:
                    </Text>
                    <Text
                      variant='body'
                      size='lg'
                      className='font-bold text-orange-400'
                    >
                      ${order.total.toFixed(2)}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className='bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10'>
              <Text variant='h3' size='lg' className='text-white mb-4'>
                <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                  Información Adicional
                </span>
              </Text>

              <div className='space-y-3'>
                <div>
                  <Text variant='bodyLight' size='sm' className='text-white/70'>
                    Fecha de Orden
                  </Text>
                  <Text
                    variant='body'
                    size='sm'
                    className='font-medium text-white'
                  >
                    {new Date(order.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </div>

                <div>
                  <Text variant='bodyLight' size='sm' className='text-white/70'>
                    Estado Actual
                  </Text>
                  <span className='inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-400/30'>
                    Completado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información para el repartidor */}
        <div className='mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10'>
          <div className='flex items-center space-x-2 mb-2'>
            <span className='text-orange-400 text-lg'>🚚</span>
            <Text variant='h3' size='md' className='text-white font-semibold'>
              <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
                Información para el Repartidor
              </span>
            </Text>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <Text
                variant='bodyLight'
                size='sm'
                className='text-white/70 font-medium'
              >
                Cliente:
              </Text>
              <Text variant='body' size='sm' className='text-white'>
                {order.customer}
              </Text>
            </div>
            <div>
              <Text
                variant='bodyLight'
                size='sm'
                className='text-white/70 font-medium'
              >
                Teléfono:
              </Text>
              <Text variant='body' size='sm' className='text-white'>
                {order.phone || 'No especificado'}
              </Text>
            </div>
            <div className='md:col-span-2'>
              <Text
                variant='bodyLight'
                size='sm'
                className='text-white/70 font-medium'
              >
                Dirección de Entrega:
              </Text>
              <Text variant='body' size='sm' className='text-white'>
                {order.shippingAddress || 'No especificada'}
              </Text>
            </div>
          </div>
        </div>

        {/* Botón de Descarga Centrado */}
        <div className='mt-8 flex justify-center'>
          <Button
            variant='success'
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className='flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-lg font-semibold'
          >
            <Download className='w-5 h-5' />
            <span>
              {isDownloading ? 'Generando Imagen...' : 'Descargar Orden'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
