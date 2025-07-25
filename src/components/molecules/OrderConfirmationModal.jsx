import React from "react";
import { X, CheckCircle } from "lucide-react";
import Button from "../atoms/Button";

const OrderConfirmationModal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  const { items, subtotal, shipping, total } = orderDetails;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Contenido del modal */}
        <div className="text-center">
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Orden Confirmada!
          </h2>
          <p className="text-gray-600 mb-8">
            Tu pedido ha sido procesado exitosamente
          </p>

          {/* Detalles de la orden */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detalles de tu orden
            </h3>
            
            {/* Productos */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.image}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Resumen de costos */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío:</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Número de orden */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Número de orden:</p>
            <p className="text-lg font-bold text-blue-600">
              #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>

          {/* Mensaje de agradecimiento */}
          <p className="text-gray-600 mb-8">
            Gracias por tu compra. Recibirás un correo de confirmación con los detalles de tu pedido.
          </p>

          {/* Botón */}
          <Button
            variant="fire"
            onClick={onClose}
            className="w-full"
          >
            Continuar comprando
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal; 