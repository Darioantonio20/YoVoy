import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { X, User, Phone, MapPin, CreditCard, CheckCircle, Download } from "lucide-react";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import html2canvas from "html2canvas";
import OrderDetailsForDownload from "./OrderDetailsForDownload";

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
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempDiv);

      // Crear el contenido HTML directamente
      const content = `
        <div style="border: 4px solid #2563eb; border-radius: 8px; padding: 24px; background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%); font-family: Arial, sans-serif;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #bfdbfe;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;">
              <div style="width: 48px; height: 48px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 20px;">🛒</span>
              </div>
              <div>
                <h1 style="font-size: 24px; font-weight: bold; color: #1e40af; margin: 0;">YoVoy</h1>
                <p style="color: #2563eb; font-weight: 500; margin: 0;">Detalles de la Orden</p>
              </div>
            </div>
            <div style="background: #dcfce7; border-radius: 8px; padding: 12px; display: inline-block;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #16a34a; font-size: 20px;">✅</span>
                <span style="color: #166534; font-weight: 600;">Orden Completada</span>
              </div>
            </div>
          </div>

          <!-- Información del Cliente -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
            <div style="background: #eff6ff; border-radius: 8px; padding: 24px; border: 1px solid #bfdbfe;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span style="color: #2563eb; font-size: 20px;">👤</span>
                <h2 style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">Información del Cliente</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <p style="color: #1d4ed8; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Nombre Completo</p>
                  <p style="color: #1e3a8a; font-weight: 600; margin: 0;">${order.customer}</p>
                </div>
                <div>
                  <p style="color: #1d4ed8; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Correo Electrónico</p>
                  <p style="color: #1e3a8a; font-weight: 600; margin: 0;">${order.email}</p>
                </div>
                <div>
                  <p style="color: #1d4ed8; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Número Telefónico</p>
                  <p style="color: #1e3a8a; font-weight: 600; margin: 0;">${order.phone || "No especificado"}</p>
                </div>
                <div>
                  <p style="color: #1d4ed8; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Ubicación para Envío</p>
                  <p style="color: #1e3a8a; font-weight: 600; margin: 0;">${order.shippingAddress || "No especificada"}</p>
                </div>
              </div>
            </div>

            <div style="background: #f0fdf4; border-radius: 8px; padding: 24px; border: 1px solid #bbf7d0;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <span style="color: #16a34a; font-size: 20px;">💳</span>
                <h2 style="font-size: 18px; font-weight: bold; color: #166534; margin: 0;">Información de Pago</h2>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                  <p style="color: #15803d; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Método de Pago</p>
                  <p style="color: #14532d; font-weight: 600; margin: 0;">${getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                ${order.paymentDetails ? `
                <div>
                  <p style="color: #15803d; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Detalles de Pago</p>
                  <p style="color: #14532d; font-weight: 600; margin: 0;">${order.paymentDetails}</p>
                </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Productos -->
          <div style="background: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
            <h2 style="font-size: 18px; font-weight: bold; color: #374151; margin: 0 0 16px 0;">Productos Ordenados</h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${order.products.map((product, index) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 12px;">📦</span>
                    </div>
                    <div>
                      <p style="font-weight: 600; color: #374151; margin: 0;">${product.name}</p>
                      <p style="font-size: 12px; color: #6b7280; margin: 0;">Cantidad: ${product.quantity}</p>
                    </div>
                  </div>
                  <p style="font-weight: bold; color: #374151; margin: 0;">$${(product.price * product.quantity).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Resumen de Costos -->
          <div style="background: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
            <h2 style="font-size: 18px; font-weight: bold; color: #374151; margin: 0 0 16px 0;">Resumen de Costos</h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Subtotal:</span>
                <span style="font-weight: 600;">$${order.subtotal?.toFixed(2) || (order.total - 9.99).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Envío:</span>
                <span style="font-weight: 600;">$${order.shipping?.toFixed(2) || "9.99"}</span>
              </div>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-size: 18px; font-weight: bold; color: #374151;">Total:</span>
                  <span style="font-size: 18px; font-weight: bold; color: #2563eb;">$${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información para el repartidor -->
          <div style="background: #fef3c7; border-radius: 8px; padding: 24px; border: 2px solid #f59e0b;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
              <span style="color: #d97706; font-size: 24px;">🚚</span>
              <h2 style="font-size: 18px; font-weight: bold; color: #92400e; margin: 0;">Información para el Repartidor</h2>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <p style="color: #b45309; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Cliente:</p>
                <p style="color: #78350f; font-weight: bold; margin: 0;">${order.customer}</p>
              </div>
              <div>
                <p style="color: #b45309; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Teléfono:</p>
                <p style="color: #78350f; font-weight: bold; margin: 0;">${order.phone || "No especificado"}</p>
              </div>
              <div style="grid-column: 1 / -1;">
                <p style="color: #b45309; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Dirección de Entrega:</p>
                <p style="color: #78350f; font-weight: bold; margin: 0;">${order.shippingAddress || "No especificada"}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #bfdbfe; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              Orden #${order.id} - Generada el ${new Date(order.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p style="color: #2563eb; font-weight: 500; margin: 8px 0 0 0;">YoVoy - Tu tienda de confianza</p>
          </div>
        </div>
      `;

      tempDiv.innerHTML = content;

      // Esperar un poco para que se renderice
      await new Promise(resolve => setTimeout(resolve, 100));

      // Configuración para html2canvas
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2, // Mejor calidad
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0
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

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "efectivo":
        return "💵";
      case "transferencia":
        return "🏦";
      case "Tarjeta":
        return <CreditCard className="w-5 h-5" />;
      default:
        return "💳";
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "efectivo":
        return "Efectivo";
      case "transferencia":
        return "Transferencia Bancaria";
      case "Tarjeta":
        return "Tarjeta de Crédito/Débito";
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200" ref={modalRef}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <Text variant="h2" size="xl" className="text-gray-800">
                Detalles de la Orden
              </Text>
              <Text variant="bodyLight" size="sm" className="text-gray-600">
                {order.id} - {getPaymentMethodText(order.paymentMethod)}
              </Text>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="success"
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "Generando..." : "Descargar"}</span>
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del Cliente */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <Text variant="h3" size="lg" className="text-blue-800">
                  Información del Cliente
                </Text>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Text variant="bodyLight" size="sm" className="text-gray-600">
                    Nombre Completo
                  </Text>
                  <Text variant="body" size="md" className="font-medium text-gray-900">
                    {order.customer}
                  </Text>
                </div>
                
                <div>
                  <Text variant="bodyLight" size="sm" className="text-gray-600">
                    Correo Electrónico
                  </Text>
                  <Text variant="body" size="md" className="font-medium text-gray-900">
                    {order.email}
                  </Text>
                </div>
                
                <div>
                  <Text variant="bodyLight" size="sm" className="text-gray-600">
                    Número Telefónico
                  </Text>
                  <Text variant="body" size="md" className="font-medium text-gray-900">
                    {order.phone || "No especificado"}
                  </Text>
                </div>
                
                <div>
                  <Text variant="bodyLight" size="sm" className="text-gray-600">
                    Ubicación para Envío
                  </Text>
                  <Text variant="body" size="md" className="font-medium text-gray-900">
                    {order.shippingAddress || "No especificada"}
                  </Text>
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 flex items-center justify-center">
                  {getPaymentMethodIcon(order.paymentMethod)}
                </div>
                <Text variant="h3" size="lg" className="text-green-800">
                  Información de Pago
                </Text>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Text variant="bodyLight" size="sm" className="text-gray-600">
                    Método de Pago
                  </Text>
                  <Text variant="body" size="md" className="font-medium text-gray-900">
                    {getPaymentMethodText(order.paymentMethod)}
                  </Text>
                </div>
                
                {order.paymentDetails && (
                  <div>
                    <Text variant="bodyLight" size="sm" className="text-gray-600">
                      Detalles de Pago
                    </Text>
                    <Text variant="body" size="md" className="font-medium text-gray-900">
                      {order.paymentDetails}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Productos y Resumen */}
          <div className="space-y-6">
            {/* Productos */}
            <div className="bg-gray-50 rounded-lg p-6">
              <Text variant="h3" size="lg" className="text-gray-800 mb-4">
                Productos Ordenados
              </Text>
              
              <div className="space-y-3">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">📦</span>
                      </div>
                      <div>
                        <Text variant="body" size="sm" className="font-medium text-gray-900">
                          {product.name}
                        </Text>
                        <Text variant="bodyLight" size="xs" className="text-gray-500">
                          Cantidad: {product.quantity}
                        </Text>
                      </div>
                    </div>
                    <Text variant="body" size="sm" className="font-medium text-gray-900">
                      ${(product.price * product.quantity).toFixed(2)}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Costos */}
            <div className="bg-gray-50 rounded-lg p-6">
              <Text variant="h3" size="lg" className="text-gray-800 mb-4">
                Resumen de Costos
              </Text>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text variant="body" size="sm" className="text-gray-600">
                    Subtotal:
                  </Text>
                  <Text variant="body" size="sm" className="font-medium text-gray-900">
                    ${order.subtotal?.toFixed(2) || (order.total - 9.99).toFixed(2)}
                  </Text>
                </div>
                
                <div className="flex justify-between">
                  <Text variant="body" size="sm" className="text-gray-600">
                    Envío:
                  </Text>
                  <Text variant="body" size="sm" className="font-medium text-gray-900">
                    ${order.shipping?.toFixed(2) || "9.99"}
                  </Text>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <Text variant="body" size="lg" className="font-bold text-gray-900">
                      Total:
                    </Text>
                    <Text variant="body" size="lg" className="font-bold text-blue-600">
                      ${order.total.toFixed(2)}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <Text variant="h3" size="lg" className="text-yellow-800 mb-4">
                Información Adicional
              </Text>
              
              <div className="space-y-3">
                <div>
                  <Text variant="bodyLight" size="sm" className="text-gray-600">
                    Fecha de Orden
                  </Text>
                  <Text variant="body" size="sm" className="font-medium text-gray-900">
                    {new Date(order.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </div>
                
                <div>
                  <Text variant="bodyLight" size="sm" className="text-gray-600">
                    Estado Actual
                  </Text>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Completado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información para el repartidor */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600 text-lg">🚚</span>
            <Text variant="h3" size="md" className="text-blue-800 font-semibold">
              Información para el Repartidor
            </Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Text variant="bodyLight" size="sm" className="text-blue-700 font-medium">
                Cliente:
              </Text>
              <Text variant="body" size="sm" className="text-blue-900">
                {order.customer}
              </Text>
            </div>
            <div>
              <Text variant="bodyLight" size="sm" className="text-blue-700 font-medium">
                Teléfono:
              </Text>
              <Text variant="body" size="sm" className="text-blue-900">
                {order.phone || "No especificado"}
              </Text>
            </div>
            <div className="md:col-span-2">
              <Text variant="bodyLight" size="sm" className="text-blue-700 font-medium">
                Dirección de Entrega:
              </Text>
              <Text variant="body" size="sm" className="text-blue-900">
                {order.shippingAddress || "No especificada"}
              </Text>
            </div>
          </div>
        </div>

        {/* Botón de Cerrar */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-6"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 