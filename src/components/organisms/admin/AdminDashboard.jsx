import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import OrderTable from "../../molecules/admin/OrderTable";
import ProductTable from "../../molecules/admin/ProductTable";
import ProductForm from "../../molecules/admin/ProductForm";
import BackgroundDecorator from "../../atoms/BackgroundDecorator";
import Alert from "../../atoms/Alert";
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

  const handleLogout = async () => {
    const result = await Alert.confirm(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión del panel administrativo?"
    );

    if (result.isConfirmed) {
      window.location.href = '/';
      
      Alert.success(
        "Sesión Cerrada",
        "Has cerrado sesión exitosamente del panel administrativo"
      );
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <BackgroundDecorator />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-left">
              <div className="flex items-center mb-4 gap-2">
                <Text variant="h1" size="2xl" className="sm:text-3xl text-white">
                  <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Panel Administrativo
                  </span>
                </Text>
              </div>
              <Text variant="bodyLight" size="sm" className="sm:text-lg text-white/70">
                Gestiona tu tienda, productos y pedidos
              </Text>
            </div>
          </div>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="self-start sm:self-auto p-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all duration-300"
            title="Cerrar Sesión"
          >
            <LogOut size={20} className="sm:w-6 sm:h-6" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-white/70">
                  Total Productos
                </Text>
                <Text variant="h2" size="2xl" className="text-white">
                  {stats.totalProducts}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-white/70">
                  Productos Activos
                </Text>
                <Text variant="h2" size="2xl" className="text-white">
                  {stats.activeProducts}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-white/70">
                  Total Pedidos
                </Text>
                <Text variant="h2" size="2xl" className="text-white">
                  {stats.totalOrders}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <Text variant="bodyLight" size="sm" className="text-white/70">
                  Pedidos Pendientes
                </Text>
                <Text variant="h2" size="2xl" className="text-white">
                  {stats.pendingOrders}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveSection("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeSection === "orders"
                    ? "border-orange-400 text-orange-300"
                    : "border-transparent text-white/70 hover:text-white hover:border-white/30"
                }`}
              >
                Pedidos
              </button>
              <button
                onClick={() => setActiveSection("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeSection === "products"
                    ? "border-orange-400 text-orange-300"
                    : "border-transparent text-white/70 hover:text-white hover:border-white/30"
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
                  <Text variant="h2" size="xl" className="text-white">
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Gestión de Productos
                    </span>
                  </Text>
                  <Text variant="bodyLight" size="sm" className="text-white/70 mt-1">
                    Crea, edita y gestiona los productos de tu tienda
                  </Text>
                </div>
                <Button
                  variant="success"
                  onClick={handleCreateProduct}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <span>+</span>
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