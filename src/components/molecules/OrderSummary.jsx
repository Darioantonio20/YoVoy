import { memo } from "react";
import Button from "../atoms/Button";

const OrderSummary = memo(({ subtotal, shipping, total, onContinueShopping, onConfirmPurchase }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8">
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex justify-between text-base sm:text-lg">
          <span className="text-white/70">Subtotal:</span>
          <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base sm:text-lg">
          <span className="text-white/70">Envío:</span>
          <span className="font-semibold text-white">${shipping.toFixed(2)}</span>
        </div>
        <div className="border-t border-white/20 pt-3 sm:pt-4">
          <div className="flex justify-between text-xl sm:text-2xl font-bold text-orange-400">
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