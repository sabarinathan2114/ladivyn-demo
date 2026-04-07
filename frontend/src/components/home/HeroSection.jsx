import React from "react";
import Button from "../common/Button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0d0408] bg-[url('/images/herosection-bg.webp')] bg-cover md:bg-size-[100%_100%] bg-bottom bg-no-repeat overflow-hidden text-center border-b border-[#8c7468]/50">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,0,10,0.4)_100%)]"></div>

      <div className="relative z-10 flex flex-col items-center p-8 max-w-[800px] animate-[fadeInOffset_1.5s_ease-out]">
        <div className="mb-10 flex flex-col items-center">
          <img
            src="/images/logo.webp"
            alt="La Divyn - Curated by Mobe"
            className="w-[80vw] max-w-[300px] md:max-w-[400px] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          />
        </div>

        <div className="mb-12">
          <h2 className="font-['Playfair_Display',serif] text-[1.8rem] md:text-[2.5rem] text-[#F8F8F8] m-0 font-normal leading-snug">
            Rooted in Nature.
          </h2>
          <h2 className="font-['Playfair_Display',serif] text-[1.8rem] md:text-[2.5rem] italic text-[#E2E2E2] m-0 font-normal leading-snug">
            Crafted for Timeless Elegance.
          </h2>

          <p className="font-['Inter',sans-serif] text-[0.9rem] md:text-base px-4 md:px-0 text-[#c0b8b8] leading-relaxed font-light mt-6 max-w-[650px]">
            Discover the quiet luxury of natural crystals and gemstones—
            <br />
            each piece thoughtfully crafted with intention—to complement
            <br />
            not just your style, but your presence.
          </p>
        </div>

        <Button onClick={() => console.log("Explore clicked")}>
          Explore Collection
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
