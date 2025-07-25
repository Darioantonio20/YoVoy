import React, { useState, useEffect } from "react";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import ordersData from "../../../data/admin/orders.json";

const OrderTable = ({ orders, onViewOrder, onUpdateStatus }) => {
  const [ordersToDisplay, setOrdersToDisplay] = useState([]);

  useEffect(() => {
    // Si no se pasan orders como prop, usar los datos del JSON
    if (orders && orders.length > 0) {
      setOrdersToDisplay(orders);
    } else {
      setOrdersToDisplay(ordersData);
    }
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "en_proceso":
        return "bg-blue-100 text-blue-800";
      case "completado":
        return "bg-green-100 text-green-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pendiente":
        return "Pendiente";
      case "en_proceso":
        return "En Proceso";
      case "completado":
        return "Completado";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <Text variant="h3" size="lg" className="text-gray-800">
          Pedidos Registrados
        </Text>
        <Text variant="bodyLight" size="sm" className="text-gray-600 mt-1">
          Gestiona todos los pedidos de tu tienda
        </Text>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersToDisplay.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" size="sm" className="font-medium text-gray-900">
                    {order.id}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <Text variant="body" size="sm" className="font-medium text-gray-900">
                      {order.customer}
                    </Text>
                    <Text variant="bodyLight" size="xs" className="text-gray-500">
                      {order.email}
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.products.map((product, index) => (
                      <div key={index} className="mb-1">
                        {product.quantity}x {product.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" size="sm" className="font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewOrder(order)}
                      className="text-xs"
                    >
                      Ver
                    </Button>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="completado">Completado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordersToDisplay.length === 0 && (
        <div className="text-center py-8">
          <Text variant="bodyLight" size="md" className="text-gray-500">
            No hay pedidos registrados aún
          </Text>
        </div>
      )}
    </div>
  );
};

export default OrderTable; 