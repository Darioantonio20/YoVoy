/**
 * Algoritmo de tarifas dinámicas para envíos
 * Calcula el costo de envío basado en la hora del día
 */

// Tarifa base de envío
const BASE_DELIVERY_FEE = 10;

// Horarios y tarifas adicionales
const TIME_SLOTS = {
  DAYTIME: { start: 6, end: 19, additionalFee: 0, name: 'Día' }, // 6 AM - 7 PM
  NIGHT: { start: 20, end: 23, additionalFee: 5, name: 'Noche' }, // 8 PM - 11 PM
  MIDNIGHT: { start: 0, end: 0, additionalFee: 5, name: 'Medianoche' }, // 12 AM
  EARLY_MORNING: { start: 1, end: 5, additionalFee: 5, name: 'Madrugada' } // 1 AM - 5 AM
};

/**
 * Calcula la tarifa de envío basada en la hora actual
 * @param {Date} orderTime - Fecha y hora del pedido (opcional, usa hora actual si no se proporciona)
 * @returns {Object} - Objeto con la tarifa calculada y detalles
 */
export const calculateDeliveryFee = (orderTime = new Date()) => {
  const hour = orderTime.getHours();
  let additionalFee = 0;
  let timeSlotName = '';

  // Determinar el horario y tarifa adicional
  if (hour >= TIME_SLOTS.DAYTIME.start && hour <= TIME_SLOTS.DAYTIME.end) {
    // 6 AM - 7 PM: tarifa base sin adicional
    additionalFee = TIME_SLOTS.DAYTIME.additionalFee;
    timeSlotName = TIME_SLOTS.DAYTIME.name;
  } else if (hour >= TIME_SLOTS.NIGHT.start && hour <= TIME_SLOTS.NIGHT.end) {
    // 8 PM - 11 PM: $5 adicional
    additionalFee = TIME_SLOTS.NIGHT.additionalFee;
    timeSlotName = TIME_SLOTS.NIGHT.name;
  } else if (hour === TIME_SLOTS.MIDNIGHT.start) {
    // 12 AM (medianoche): $5 adicional
    additionalFee = TIME_SLOTS.MIDNIGHT.additionalFee;
    timeSlotName = TIME_SLOTS.MIDNIGHT.name;
  } else if (hour >= TIME_SLOTS.EARLY_MORNING.start && hour <= TIME_SLOTS.EARLY_MORNING.end) {
    // 1 AM - 5 AM: $5 por cada hora de madrugada
    additionalFee = hour * TIME_SLOTS.EARLY_MORNING.additionalFee;
    timeSlotName = `${TIME_SLOTS.EARLY_MORNING.name} (${hour}:00)`;
  }

  const totalDeliveryFee = BASE_DELIVERY_FEE + additionalFee;

  return {
    baseFee: BASE_DELIVERY_FEE,
    additionalFee: additionalFee,
    totalFee: totalDeliveryFee,
    timeSlot: timeSlotName,
    hour: hour,
    isLateNight: hour >= 22 || hour <= 5,
    breakdown: {
      base: BASE_DELIVERY_FEE,
      timeAdjustment: additionalFee,
      total: totalDeliveryFee
    }
  };
};



/**
 * Obtiene el nombre del horario actual
 * @param {Date} date - Fecha (opcional)
 * @returns {string} - Nombre del horario
 */
export const getCurrentTimeSlot = (date = new Date()) => {
  const hour = date.getHours();
  
  if (hour >= 6 && hour <= 19) return 'Día';
  if (hour >= 20 && hour <= 23) return 'Noche';
  if (hour === 0) return 'Medianoche';
  if (hour >= 1 && hour <= 5) return 'Madrugada';
  
  return 'Horario no definido';
};

/**
 * Formatea la hora en formato legible
 * @param {Date} date - Fecha
 * @returns {string} - Hora formateada
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Obtiene información detallada del horario actual
 * @param {Date} date - Fecha (opcional)
 * @returns {Object} - Información del horario
 */
export const getTimeSlotInfo = (date = new Date()) => {
  const hour = date.getHours();
  const timeSlot = getCurrentTimeSlot(date);
  const deliveryInfo = calculateDeliveryFee(date);
  
  return {
    currentHour: hour,
    timeSlot: timeSlot,
    deliveryFee: deliveryInfo.totalFee,
    additionalFee: deliveryInfo.additionalFee,
    isLateNight: deliveryInfo.isLateNight,
    formattedTime: formatTime(date)
  };
};

export default {
  calculateDeliveryFee,
  getCurrentTimeSlot,
  formatTime,
  getTimeSlotInfo
}; 