import { memo } from "react";

const Button = memo(({ children, variant = "primary", className = "", disabled = false, ...props }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:from-green-700 hover:to-green-800 focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 focus:ring-red-500"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 