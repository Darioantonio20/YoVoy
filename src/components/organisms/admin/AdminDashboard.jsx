import React, { useState, useEffect } from "react";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import OrderTable from "../../molecules/admin/OrderTable";
import ProductTable from "../../molecules/admin/ProductTable";
import ProductForm from "../../molecules/admin/ProductForm";
import ordersData from "../../../data/admin/orders.json";
import productsData from "../../../data/admin/products.json";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Cargar datos iniciales desde JSON
  useEffect(() => {
    setOrders(ordersData);
    setProducts(productsData);
  }, []);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Actualizar producto existente
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      // Crear nuevo producto
      setProducts(prev => [...prev, productData]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleToggleProductStatus = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  const getStats = () => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "pendiente").length;

    return { totalProducts, activeProducts, totalOrders, pendingOrders };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Text variant="h1" size="3xl" className="text-gray-900 mb-2">
            Panel Administrativo
          </Text>
          <Text variant="bodyLight" size="lg" className="text-gray-600">
            Gestiona tu tienda, productos y pedidos
          </Text>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-gray-600">
                  Total Productos
                </Text>
                <Text variant="h2" size="2xl" className="text-gray-900">
                  {stats.totalProducts}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-gray-600">
                  Productos Activos
                </Text>
                <Text variant="h2" size="2xl" className="text-gray-900">
                  {stats.activeProducts}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-gray-600">
                  Total Pedidos
                </Text>
                <Text variant="h2" size="2xl" className="text-gray-900">
                  {stats.totalOrders}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-gray-600">
                  Pedidos Pendientes
                </Text>
                <Text variant="h2" size="2xl" className="text-gray-900">
                  {stats.pendingOrders}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveSection("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === "orders"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pedidos
              </button>
              <button
                onClick={() => setActiveSection("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === "products"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Productos
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeSection === "orders" && (
            <OrderTable
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {activeSection === "products" && (
            <div className="space-y-6">
              {/* Header con botón de crear */}
              <div className="flex justify-between items-center">
                <div>
                  <Text variant="h2" size="xl" className="text-gray-800">
                    Gestión de Productos
                  </Text>
                  <Text variant="bodyLight" size="sm" className="text-gray-600 mt-1">
                    Crea, edita y gestiona los productos de tu tienda
                  </Text>
                </div>
                <Button
                  variant="success"
                  onClick={handleCreateProduct}
                  className="flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>Crear Producto</span>
                </Button>
              </div>

              {/* Formulario de producto */}
              {showProductForm && (
                <ProductForm
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={handleCancelProductForm}
                  isEditing={!!editingProduct}
                />
              )}

              {/* Tabla de productos */}
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onToggleStatus={handleToggleProductStatus}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 