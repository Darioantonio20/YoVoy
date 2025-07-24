import React from "react";
import Text from "../atoms/Text";

const AdminPanel = () => {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#0d1b2a] rounded-lg shadow-2xl p-8 mt-8">
      <Text variant="h2" size="2xl" className="text-gray-50 mb-4">
        Panel Administrativo
      </Text>
      <Text variant="bodyLight" size="md" className="text-gray-400 text-center max-w-xl">
        ¡Bienvenido! Aquí podrás gestionar tu tienda. Próximamente podrás ver estadísticas, productos, pedidos y más.
      </Text>
    </div>
  );
};

export default AdminPanel; 