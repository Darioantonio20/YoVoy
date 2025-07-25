import React, { useState, useEffect } from "react";
import Button from "../../atoms/Button";
import Text from "../../atoms/Text";
import productsData from "../../../data/admin/products.json";

const ProductTable = ({ products, onEdit, onDelete, onToggleStatus }) => {
  const [productsToDisplay, setProductsToDisplay] = useState([]);

  useEffect(() => {
    // Si no se pasan products como prop, usar los datos del JSON
    if (products && products.length > 0) {
      setProductsToDisplay(products);
    } else {
      setProductsToDisplay(productsData);
    }
  }, [products]);

  const getCategoryLabel = (category) => {
    const categories = {
      juguetes: "Juguetes",
      ropa: "Ropa",
      electronica: "Electrónica",
      hogar: "Hogar",
      deportes: "Deportes"
    };
    return categories[category] || category;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return "bg-red-100 text-red-800";
    if (stock < 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockText = (stock) => {
    if (stock === 0) return "Sin stock";
    if (stock < 5) return "Stock bajo";
    return "En stock";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <Text variant="h3" size="lg" className="text-gray-800">
          Productos de la Tienda
        </Text>
        <Text variant="bodyLight" size="sm" className="text-gray-600 mt-1">
          Gestiona el catálogo de productos
        </Text>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productsToDisplay.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xl">{product.image}</span>
                    </div>
                    <div>
                      <Text variant="body" size="sm" className="font-medium text-gray-900">
                        {product.name}
                      </Text>
                      <Text variant="bodyLight" size="xs" className="text-gray-500">
                        {product.description}
                      </Text>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {getCategoryLabel(product.category)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" size="sm" className="font-medium text-gray-900">
                    {product.price}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatus(product.stock)}`}>
                      {getStockText(product.stock)}
                    </span>
                    <Text variant="bodyLight" size="xs" className="text-gray-500 ml-2">
                      ({product.stock})
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-xs"
                    >
                      Editar
                    </Button>
                    <Button
                      variant={product.isActive ? "warning" : "success"}
                      size="sm"
                      onClick={() => onToggleStatus(product.id)}
                      className="text-xs"
                    >
                      {product.isActive ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-xs"
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productsToDisplay.length === 0 && (
        <div className="text-center py-8">
          <Text variant="bodyLight" size="md" className="text-gray-500">
            No hay productos registrados aún
          </Text>
        </div>
      )}
    </div>
  );
};

export default ProductTable; 