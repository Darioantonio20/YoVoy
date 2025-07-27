import { memo } from 'react';

const Text = memo(
  ({
    children,
    variant = 'body',
    size = 'base',
    className = '',
    as: Component = 'div',
    ...props
  }) => {
    const variants = {
      // Variantes de títulos
      h1: 'font-black tracking-tight leading-none',
      h2: 'font-bold tracking-tight leading-tight',
      h3: 'font-semibold tracking-normal leading-tight',
      h4: 'font-medium tracking-normal leading-normal',

      // Variantes de texto
      body: 'font-normal leading-relaxed',
      bodyBold: 'font-semibold leading-relaxed',
      bodyLight: 'font-light leading-relaxed',

      // Variantes especiales
      display: 'font-display font-black tracking-tight leading-none',
      curved: 'font-curved font-medium leading-relaxed',
      curvedBold: 'font-curved font-bold leading-relaxed',
      curvedLight: 'font-curved font-light leading-relaxed',

      // Variantes de UI
      caption: 'font-medium text-sm leading-tight',
      label: 'font-semibold text-sm leading-tight uppercase tracking-wide',
      code: 'font-mono text-sm leading-tight',

      // Variantes decorativas
      hero: 'font-black tracking-tight leading-none text-glow',
      subtitle: 'font-light leading-relaxed opacity-90',
      quote: 'font-curved font-medium italic leading-relaxed',
      accent: 'font-semibold leading-normal',
    };

    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
      '9xl': 'text-9xl',
    };

    const baseClasses = 'transition-colors duration-200';

    return (
      <Component
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export default Text;
