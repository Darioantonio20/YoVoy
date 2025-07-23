import { memo } from "react";

const FeatureCard = memo(({ icon, title, bgColor = "bg-blue-100" }) => {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard; 