import { memo } from "react";
import { Link } from "react-router-dom";
import Button from "../atoms/Button";
import FeatureCard from "../molecules/FeatureCard";

const HeroSection = memo(() => {
  const features = [
    { icon: "🛒", title: "Compra Segura", bgColor: "bg-blue-100" },
    { icon: "🚚", title: "Envío Rápido", bgColor: "bg-green-100" },
    { icon: "💎", title: "Calidad Premium", bgColor: "bg-purple-100" }
  ];

  return (
    <div className="text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          YoVoy
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tu tienda online de confianza. Descubre productos increíbles y disfruta de una experiencia de compra excepcional.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4 mb-12">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            bgColor={feature.bgColor}
          />
        ))}
      </div>

      <Link to="/login">
        <Button className="text-lg px-8 py-4">
          🚀 Comenzar a Comprar
        </Button>
      </Link>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection; 