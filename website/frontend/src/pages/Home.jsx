import HeroSection from "../components/home/HeroSection";
import ProductSection from "../components/home/ProductSection";
import GemstoneSection from "../components/home/GemstoneSection";
import AboutSection from "../components/home/AboutSection";
import Navbar from "../components/common/navbar";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <HeroSection />
      <ProductSection />
      <GemstoneSection />
      <AboutSection />
    </div>
  );
};

export default Home;
