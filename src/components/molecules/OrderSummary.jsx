import { memo } from "react";
import Button from "../atoms/Button";

const OrderSummary = memo(({ subtotal, shipping, total, onContinueShopping, onConfirmPurchase }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Resumen de Compra</h2>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-lg">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="text-gray-600">Envío:</span>
          <span className="font-semibold">${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-2xl font-bold text-blue-600">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="secondary" className="flex-1" onClick={onContinueShopping}>
          ← Seguir Comprando
        </Button>
        <Button className="flex-1" onClick={onConfirmPurchase}>
          ✅ Confirmar Compra
        </Button>
      </div>
    </div>
  );
});

OrderSummary.displayName = 'OrderSummary';

export default OrderSummary; 