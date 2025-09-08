import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, User } from 'lucide-react';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import Dither from './Dither';
import LoginForm from './LoginForm';

const HeroSection = memo(() => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleBackToHome = () => {
    setShowLoginForm(false);
  };

  return (
    <div className='relative w-full h-screen'>
      {/* Canvas de Three.js como fondo */}
      <div className='absolute inset-0'>
        <Dither
          waveSpeed={0.05}
          waveFrequency={2}
          waveAmplitude={0.1}
          waveColor={[0.4, 0.4, 0.4]}
          colorNum={4}
          pixelSize={2}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.2}
        />
      </div>

      {/* Contenido condicional */}
      {!showLoginForm ? (
        // Contenido del Hero original
        <div className='relative z-20 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none'>
          <div className='mb-12 pointer-events-none'>
            <Text
              as='h1'
              variant='hero'
              size='7xl'
              className='text-white mb-6 drop-shadow-2xl md:text-8xl'
            >
              FlyGo Flash!
            </Text>
            <Text
              as='p'
              variant='curvedLight'
              size='2xl'
              className='text-white/90 max-w-3xl mx-auto drop-shadow-lg md:text-3xl'
            >
              Compra tus productos y Jasai se encarga de llevartelos
            </Text>
          </div>

          {/* Botones centrados - con pointer-events para ser interactivos */}
          <div className='flex gap-6 flex-wrap justify-center pointer-events-auto'>
            <Button
              variant='fire'
              className='text-lg px-10 py-4 flex items-center gap-3 font-curved font-medium'
              onClick={handleLoginClick}
            >
              <LogIn size={22} />
              Iniciar Sesión
            </Button>

            <Link to='/store'>
              <Button
                variant='liquid'
                className='text-lg px-10 py-4 flex items-center gap-3 font-curved font-medium'
              >
                <User size={22} />
                Modo Invitado
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        // LoginForm centrado
        <div className='relative z-20 flex items-center justify-center h-full px-4 pointer-events-none'>
          <div className='relative pointer-events-auto'>
            {/* LoginForm con botón de back */}
            <LoginForm onBack={handleBackToHome} />
          </div>
        </div>
      )}
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
