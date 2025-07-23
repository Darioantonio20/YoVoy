import { useState, useCallback } from "react";
import Button from "../components/atoms/Button";
import Modal from "../components/atoms/Modal";
import Alert from "../components/atoms/Alert";

const paymentMethods = [
  { id: "card", name: "Tarjeta de Crédito/Débito", icon: "💳" },
  { id: "paypal", name: "PayPal", icon: "🔵" },
  { id: "transfer", name: "Transferencia Bancaria", icon: "🏦" },
  { id: "cash", name: "Efectivo", icon: "💰" }
];

export default function Confirm() {
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const handlePaymentOpen = useCallback(() => setShowPayment(true), []);
  const handlePaymentClose = useCallback(() => setShowPayment(false), []);
  const handleSuccessClose = useCallback(() => setShowSuccess(false), []);
  
  const handlePaymentConfirm = useCallback(() => {
    setShowPayment(false);
    setShowSuccess(true);
  }, []);

  const handlePaymentSelect = useCallback((e) => {
    setSelectedPayment(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Confirmar Compra</h1>
            <p className="text-xl text-gray-600">
              Estás a un paso de completar tu compra. Revisa los detalles y selecciona tu método de pago.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Resumen de tu Orden</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Total de Productos:</span>
                <span className="font-semibold">3 items</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">$229.97</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Envío:</span>
                <span className="font-semibold">$9.99</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-2xl font-bold text-blue-600">
                  <span>Total Final:</span>
                  <span>$239.96</span>
                </div>
              </div>
            </div>

            <Button onClick={handlePaymentOpen} className="w-full text-lg py-4">
              💳 Proceder al Pago
            </Button>
          </div>
        </div>
      </div>

      <Modal open={showPayment} onClose={handlePaymentClose} title="💳 Método de Pago">
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">Selecciona tu método de pago preferido:</p>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={handlePaymentSelect}
                  className="mr-3"
                />
                <span className="text-2xl mr-3">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>

          <div className="flex space-x-4 pt-4">
            <Button variant="secondary" onClick={handlePaymentClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handlePaymentConfirm}
              className="flex-1"
              disabled={!selectedPayment}
            >
              Confirmar Pago
            </Button>
          </div>
        </div>
      </Modal>

      <Alert 
        open={showSuccess} 
        onClose={handleSuccessClose} 
        type="success"
        autoClose={true}
        autoCloseDelay={3000}
      >
        <div className="space-y-2">
          <div className="font-bold text-lg">¡Compra Confirmada!</div>
          <div>Tu pedido ha sido procesado exitosamente.</div>
          <div className="text-sm text-green-600">Número de orden: #12345</div>
        </div>
      </Alert>
    </div>
  );
} 