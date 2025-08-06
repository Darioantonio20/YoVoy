const OrderDownloadTemplate = ({ order, getPaymentMethodText }) => {
  // Calcular tarifa de envío dinámica
  const orderTime = new Date(order.date);
  const deliveryInfo = (() => {
    const hour = orderTime.getHours();
    let additionalFee = 0;
    let timeSlotName = '';
    
    if (hour >= 6 && hour <= 19) {
      // 6 AM - 7 PM: tarifa base sin adicional
      additionalFee = 0;
      timeSlotName = 'Día';
    } else if (hour >= 20 && hour <= 23) {
      // 8 PM - 11 PM: $5 adicional
      additionalFee = 5;
      timeSlotName = 'Noche';
    } else if (hour === 0) {
      // 12 AM (medianoche): $5 adicional
      additionalFee = 5;
      timeSlotName = 'Medianoche';
    } else if (hour >= 1 && hour <= 5) {
      // 1 AM - 5 AM: $5 por cada hora de madrugada
      additionalFee = hour * 5;
      timeSlotName = `Madrugada (${hour}:00)`;
    }
    
    return {
      baseFee: 10,
      additionalFee: additionalFee,
      totalFee: 10 + additionalFee,
      timeSlot: timeSlotName
    };
  })();
  return `
    <div style="border: 4px solid #f97316; border-radius: 12px; padding: 32px; background: linear-gradient(135deg, #1f2937 0%, #111827 100%); font-family: Arial, sans-serif; color: white;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #f97316;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f97316 0%, #eab308 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 20px;">🛒</span>
          </div>
          <div>
            <h1 style="font-size: 24px; font-weight: bold; color: #f97316; margin: 0;">Jasai</h1>
            <p style="color: #eab308; font-weight: 500; margin: 0;">Detalles de la Orden</p>
          </div>
        </div>
        <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; border-radius: 8px; padding: 12px; display: inline-block;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #22c55e; font-size: 20px;">✅</span>
            <span style="color: #22c55e; font-weight: 600;">Orden Completada</span>
          </div>
        </div>
      </div>

      <!-- Información del Cliente -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 24px; border: 1px solid rgba(249, 115, 22, 0.3);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <span style="color: #f97316; font-size: 20px;">👤</span>
            <h2 style="font-size: 18px; font-weight: bold; color: #f97316; margin: 0;">Información del Cliente</h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Nombre Completo</p>
              <p style="color: white; font-weight: 600; margin: 0;">${order.customer?.name || order.customer || 'Cliente'}</p>
            </div>
            <div>
              <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Correo Electrónico</p>
              <p style="color: white; font-weight: 600; margin: 0;">${order.customer?.email || order.email || 'Sin email'}</p>
            </div>
            <div>
              <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Número Telefónico</p>
              <p style="color: white; font-weight: 600; margin: 0;">${order.customer?.phone || order.phone || 'No especificado'}</p>
            </div>
            <div>
              <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Ubicación para Envío</p>
              <p style="color: white; font-weight: 600; margin: 0;">${order.customer?.location?.alias || order.shippingAddress || 'No especificada'}</p>
            </div>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 24px; border: 1px solid rgba(34, 197, 94, 0.3);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <span style="color: #22c55e; font-size: 20px;">💳</span>
            <h2 style="font-size: 18px; font-weight: bold; color: #22c55e; margin: 0;">Información de Pago</h2>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Método de Pago</p>
              <p style="color: white; font-weight: 600; margin: 0;">${getPaymentMethodText(order.paymentMethod)}</p>
            </div>
            ${
              order.paymentDetails
                ? `
            <div>
              <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Detalles de Pago</p>
              <p style="color: white; font-weight: 600; margin: 0;">${order.paymentDetails}</p>
            </div>
            `
                : ''
            }
          </div>
        </div>
      </div>

      <!-- Productos -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 24px; margin-bottom: 32px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <h2 style="font-size: 18px; font-weight: bold; color: #f97316; margin: 0 0 16px 0;">Productos Ordenados</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${order.products
            .map(
              (product, index) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 179, 8, 0.2) 100%); border: 1px solid rgba(249, 115, 22, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 12px;">📦</span>
                </div>
                <div>
                  <p style="font-weight: 600; color: white; margin: 0;">${product.name}</p>
                  <p style="font-size: 12px; color: #eab308; margin: 0;">Cantidad: ${product.quantity}</p>
                  ${product.note ? `<p style="font-size: 11px; color: #f97316; margin: 4px 0 0 0; font-style: italic;">Nota Cliente: "${product.note}"</p>` : ''}
                  ${product.adminNote ? `<p style="font-size: 11px; color: #3b82f6; margin: 4px 0 0 0; font-style: italic;">Nota Admin: "${product.adminNote}"</p>` : ''}
                </div>
              </div>
              <p style="font-weight: bold; color: #f97316; margin: 0;">$${((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Resumen de Costos -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 24px; margin-bottom: 32px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <h2 style="font-size: 18px; font-weight: bold; color: #f97316; margin: 0 0 16px 0;">Resumen de Costos</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #eab308;">Subtotal:</span>
            <span style="font-weight: 600; color: white;">$${(order.subtotal || (order.total || order.totals?.total || 0) - 9.99).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #eab308;">Envío:</span>
            <span style="font-weight: 600; color: white;">$${deliveryInfo.totalFee.toFixed(2)}</span>
          </div>
          <div style="border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 12px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 18px; font-weight: bold; color: white;">Total:</span>
              <span style="font-size: 18px; font-weight: bold; color: #f97316;">$${(order.total || order.totals?.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Información para el repartidor -->
      <div style="background: rgba(249, 115, 22, 0.1); border-radius: 8px; padding: 24px; border: 2px solid #f97316;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
          <span style="color: #f97316; font-size: 24px;">🚚</span>
          <h2 style="font-size: 18px; font-weight: bold; color: #f97316; margin: 0;">Información para el Repartidor</h2>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Cliente:</p>
            <p style="color: white; font-weight: bold; margin: 0;">${order.customer?.name || order.customer || 'Cliente'}</p>
          </div>
          <div>
            <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Teléfono:</p>
            <p style="color: white; font-weight: bold; margin: 0;">${order.customer?.phone || order.phone || 'No especificado'}</p>
          </div>
          <div style="grid-column: 1 / -1;">
            <p style="color: #eab308; font-weight: 500; font-size: 14px; margin: 0 0 4px 0;">Dirección de Entrega:</p>
            <p style="color: white; font-weight: bold; margin: 0;">${order.customer?.location?.alias || order.shippingAddress || 'No especificada'}</p>
          </div>
        </div>
      </div>

      ${(order.notes || order.products.some(p => p.note || p.adminNote)) ? `
      <!-- Notas de la Orden -->
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 24px; margin-bottom: 32px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <h2 style="font-size: 18px; font-weight: bold; color: #f97316; margin: 0 0 16px 0;">Notas de la Orden</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${order.notes ? `
          <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7; border-radius: 8px; padding: 12px;">
            <p style="color: #a855f7; font-weight: 600; font-size: 12px; margin: 0 0 4px 0;">Nota General:</p>
            <p style="color: white; font-style: italic; margin: 0;">"${order.notes}"</p>
          </div>
          ` : ''}
          ${order.products.some(p => p.note) ? `
          <div style="background: rgba(249, 115, 22, 0.1); border: 1px solid #f97316; border-radius: 8px; padding: 12px;">
            <p style="color: #f97316; font-weight: 600; font-size: 12px; margin: 0 0 4px 0;">Notas del Cliente:</p>
            ${order.products.filter(p => p.note).map(product => `
            <p style="color: white; font-size: 12px; margin: 4px 0; font-style: italic;">• <strong>${product.name}:</strong> "${product.note}"</p>
            `).join('')}
          </div>
          ` : ''}
          ${order.products.some(p => p.adminNote) ? `
          <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 8px; padding: 12px;">
            <p style="color: #3b82f6; font-weight: 600; font-size: 12px; margin: 0 0 4px 0;">Notas del Admin:</p>
            ${order.products.filter(p => p.adminNote).map(product => `
            <p style="color: white; font-size: 12px; margin: 4px 0; font-style: italic;">• <strong>${product.name}:</strong> "${product.adminNote}"</p>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #f97316; text-align: center;">
        <p style="color: #eab308; font-size: 12px; margin: 0;">
          Orden #${order.id || order._id || order.orderNumber || 'N/A'} - Generada el ${new Date(
            order.date || order.createdAt || new Date()
          ).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p style="color: #f97316; font-weight: 500; margin: 8px 0 0 0;">Jasai - Tu tienda de confianza</p>
      </div>
    </div>
  `;
};

export default OrderDownloadTemplate;
