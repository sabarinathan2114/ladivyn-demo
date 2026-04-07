import React from "react";
import HeroSection from "../components/home/HeroSection";
import ProductSection from "../components/home/ProductSection";
import AboutSection from "../components/home/AboutSection";

const Home = () => {
  return (
    <div className="home-container">
      <HeroSection />
      <ProductSection />
      <AboutSection />
    </div>
  );
};

export default Home;
