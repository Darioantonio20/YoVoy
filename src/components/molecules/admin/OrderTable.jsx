import React, { useState, useEffect } from 'react';
import Spinner from '../../atoms/Spinner';
import { Eye } from 'lucide-react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import SearchBar from '../../atoms/SearchBar';
import OrderDetailsModal from './OrderDetailsModal';

const OrderTable = ({ orders, onUpdateStatus, isLoading = false }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersToDisplay, setOrdersToDisplay] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setOrdersToDisplay(orders || []);
  }, [orders]);

  // Filtrar pedidos basado en el término de búsqueda
  const filteredOrders = ordersToDisplay.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    
    // Buscar por número de orden
    const orderNumber = (order.id || order._id || order.orderNumber || '').toString().toLowerCase();
    if (orderNumber.includes(searchLower)) return true;
    
    // Buscar por nombre del cliente
    const customerName = (order.customer?.name || order.customer || '').toLowerCase();
    if (customerName.includes(searchLower)) return true;
    
    // Buscar por email del cliente
    const customerEmail = (order.customer?.email || order.email || '').toLowerCase();
    if (customerEmail.includes(searchLower)) return true;
    
    // Buscar por estado
    const status = (order.status || '').toLowerCase();
    if (status.includes(searchLower)) return true;
    
    // Buscar por productos
    const products = (order.products || []).map(p => p.name).join(' ').toLowerCase();
    if (products.includes(searchLower)) return true;
    
    return false;
  });

  const getStatusColor = status => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30';
      case 'en_proceso':
        return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
      case 'completado':
        return 'bg-green-500/20 text-green-300 border border-green-400/30';
      case 'cancelado':
        return 'bg-red-500/20 text-red-300 border border-red-400/30';
      default:
        return 'bg-white/10 text-white/70 border border-white/20';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleViewDetails = order => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleSearch = () => {
    // La búsqueda se actualiza automáticamente con el filtro
  };

  return (
    <>
      {isLoading && <Spinner message='Cargando pedidos...' />}
      <div className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden'>
        <div className='px-6 py-4 border-b border-white/20'>
          <Text variant='h3' size='lg' className='text-white'>
            <span className='bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent'>
              Pedidos Registrados
            </span>
          </Text>
          <Text variant='bodyLight' size='sm' className='text-white/70 mt-1'>
            Gestiona todos los pedidos de tu tienda
          </Text>
        </div>

        {/* Barra de búsqueda */}
        <div className='px-6 py-4 border-b border-white/10'>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Buscar por cliente, orden, estado, productos...'
            onSearch={handleSearch}
            showSearchButton={false}
            className='mb-0'
          />
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-white/5'>
              <tr>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Orden
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Cliente
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Productos
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Notas
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Fecha
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white/5 divide-y divide-white/10'>
              {filteredOrders.map(order => (
                <tr
                  key={order.id || order._id || order.orderNumber}
                  className='hover:bg-white/5 transition-colors duration-200'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <Text
                      variant='body'
                      size='sm'
                      className='font-medium text-white'
                    >
                      {order.id || order._id || order.orderNumber || 'N/A'}
                    </Text>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <div>
                      <Text
                        variant='body'
                        size='sm'
                        className='font-medium text-white'
                      >
                        {order.customer?.name || order.customer || 'Cliente'}
                      </Text>
                      <Text
                        variant='bodyLight'
                        size='xs'
                        className='text-white/70'
                      >
                        {order.customer?.email || order.email || 'Sin email'}
                      </Text>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <div className='text-sm text-white'>
                      {(order.products || []).map((product, index) => (
                        <div key={`${order.id || order._id}-product-${index}`} className='mb-2 last:mb-0'>
                          <div className='flex items-center gap-1 justify-center'>
                            <span>{product.quantity}x</span>
                            <span className='font-medium'>{product.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm space-y-2'>
                      {(order.products || []).map((product, index) => (
                        <div key={`${order.id || order._id}-note-${index}`} className='flex items-start gap-2'>
                          <div className='w-5 h-5 flex-shrink-0 mt-0.5'>
                            {product.note ? (
                              <div className='w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/30'>
                                <span className='text-orange-400 text-sm'>📝</span>
                              </div>
                            ) : (
                              <div className='w-5 h-5 bg-white/5 rounded-full flex items-center justify-center border border-white/10'>
                                <span className='text-white/30 text-xs'>-</span>
                              </div>
                            )}
                          </div>
                          {product.note ? (
                            <p className='text-orange-300/90 text-sm italic'>
                              "{product.note}"
                            </p>
                          ) : (
                            <p className='text-white/30 text-sm'>
                              Sin nota
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <Text
                      variant='body'
                      size='sm'
                      className='font-medium text-white'
                    >
                      ${(order.total || order.totals?.total || 0).toFixed(2)}
                    </Text>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-white/70 text-center'>
                    {order.date ? new Date(order.date).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-center'>
                    <div className='flex space-x-2 justify-center'>
                      {/* Botón de detalles - solo visible si está completado */}
                      {(order.status || '') === 'completado' && (
                        <Button
                          variant='success'
                          onClick={() => handleViewDetails(order)}
                          className='text-xs px-3 py-1 flex items-center space-x-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-400/30'
                        >
                          <Eye className='w-3 h-3' />
                          <span>Detalles</span>
                        </Button>
                      )}

                      {/* Selector de estado */}
                      <select
                        value={order.status || 'pendiente'}
                        onChange={e => onUpdateStatus(order.id || order._id, e.target.value)}
                        className='text-xs border border-white/20 rounded px-2 py-1 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-orange-400'
                      >
                        <option
                          value='pendiente'
                          className='bg-gray-800 text-white'
                        >
                          Pendiente
                        </option>
                        <option
                          value='en_proceso'
                          className='bg-gray-800 text-white'
                        >
                          En Proceso
                        </option>
                        <option
                          value='completado'
                          className='bg-gray-800 text-white'
                        >
                          Completado
                        </option>
                        <option
                          value='cancelado'
                          className='bg-gray-800 text-white'
                        >
                          Cancelado
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredOrders.length === 0 && (
          <div className='text-center py-8'>
            <Text variant='bodyLight' size='md' className='text-white/70'>
              {searchTerm ? `No se encontraron pedidos para "${searchTerm}"` : 'No hay pedidos registrados aún'}
            </Text>
          </div>
        )}
      </div>

      {/* Modal de detalles de la orden */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderTable;
