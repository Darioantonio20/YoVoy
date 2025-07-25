import React, { useState } from "react";
import { X, CreditCard, ArrowLeft } from "lucide-react";
import Button from "../atoms/Button";

const PaymentMethodModal = ({ isOpen, onClose, onConfirm, orderDetails }) => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  
  if (!isOpen) return null;

  const { items, subtotal, shipping, total } = orderDetails;

  const paymentMethods = [
    {
      id: "card",
      name: "Tarjeta de Crédito/Débito",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Visa, Mastercard, American Express"
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">P</div>,
      description: "Paga con tu cuenta PayPal"
    }
  ];

  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Método de Pago
          </h2>
          <p className="text-gray-600">
            Selecciona tu método de pago preferido
          </p>
        </div>

        {/* Métodos de pago */}
        <div className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  selectedMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white scale-75"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de la orden */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Resumen de la orden</h3>
          <div className="space-y-2">
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

        {/* Botones */}
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            className="flex-1"
          >
            Confirmar Pago
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal; 