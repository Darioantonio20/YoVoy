import { memo } from 'react';

const Button = memo(
  ({
    children,
    variant = 'primary',
    className = '',
    disabled = false,
    ...props
  }) => {
    const baseClasses =
      'px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500',
      secondary:
        'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500',
      success:
        'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:from-green-700 hover:to-green-800 focus:ring-green-500',
      danger:
        'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 focus:ring-red-500',

      // Variantes UI/UX modernas
      glass:
        'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20 hover:border-white/30 focus:ring-white/30',
      neon: 'bg-transparent border-2 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.8)] focus:ring-cyan-400',
      minimal:
        'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-400',
      bold: 'bg-black text-white border-2 border-black shadow-lg hover:bg-white hover:text-black focus:ring-black transition-colors duration-300',
      elegant:
        'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg hover:from-slate-700 hover:to-slate-800 focus:ring-slate-500 rounded-full px-8',

      // Variante Fire con efecto Liquid Glass
      fire: 'relative overflow-hidden bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-red-300/30 text-white shadow-[0_8px_32px_rgba(239,68,68,0.3)] hover:shadow-[0_8px_32px_rgba(239,68,68,0.5)] focus:ring-red-400 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-out after:absolute after:inset-0 after:bg-gradient-to-br after:from-red-400/30 after:via-orange-400/30 after:to-yellow-400/30 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:animate-pulse',

      // Variante Liquid Glass en negro y blanco
      liquid:
        'relative overflow-hidden bg-gradient-to-br from-black/20 via-gray-800/20 to-white/10 backdrop-blur-xl border border-white/30 text-white shadow-[0_8px_32px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.4)] focus:ring-gray-400 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-out after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/20 after:via-gray-300/20 after:to-black/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:animate-pulse',
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
  }
);

Button.displayName = 'Button';

export default Button;
