import HeroSection from "../components/organisms/HeroSection";
import Spinner from "../components/atoms/Spinner";
import useSpinner from "../hooks/useSpinner";

export default function Home() {
  const { isLoading } = useSpinner(1000);

  return (
    <>
      {isLoading && <Spinner message="Cargando animaciones 3D..." />}
      <div className="min-h-screen">
        <HeroSection />
      </div>
    </>
  );
} 