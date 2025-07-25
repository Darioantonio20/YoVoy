import { memo } from "react";
import Button from "../atoms/Button";

const OrderSummary = memo(({ subtotal, shipping, total, onContinueShopping, onConfirmPurchase }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">📋 Resumen de Compra</h2>
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex justify-between text-base sm:text-lg">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base sm:text-lg">
          <span className="text-gray-600">Envío:</span>
          <span className="font-semibold">${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 sm:pt-4">
          <div className="flex justify-between text-xl sm:text-2xl font-bold text-blue-600">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="secondary" className="w-auto px-4" onClick={onContinueShopping}>
          ← 
        </Button>
        <Button variant="success" className="flex-1" onClick={onConfirmPurchase}>
          Continuar
        </Button>
      </div>
    </div>
  );
});

OrderSummary.displayName = 'OrderSummary';

export default OrderSummary; 