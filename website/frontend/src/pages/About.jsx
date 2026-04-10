import React from "react";
import Navbar from "../components/common/navbar";

const About = () => {
  return (
    <div className="h-screen w-full bg-[#170a10] text-[#F8F8F8] font-['Playfair_Display',serif] overflow-hidden">
      <Navbar />

      {/* Hero Section - Fixed to 100vh */}
      <section className="relative h-full w-full flex flex-col items-center justify-center px-6 sm:px-10 bg-[url('/images/about-gemstore-bg.png')] bg-cover bg-top bg-no-repeat overflow-hidden">
        {/* Subtle overlay to enhance text legibility if needed, keeping it very light to show the background pattern */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

        <div className="relative z-10 max-w-[90rem] w-full text-center flex flex-col items-center lg:translate-y-[10%]">
          {/* Main Title Group */}
          <div className="">
            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal tracking-wide text-[#e1d4b7] leading-tight mb-2">
              Elements of the Earth,
            </h1>
            <h2 className="text-xl min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] font-normal italic text-[#e1d4b7] opacity-90">
              Curated for the Modern Soul.
            </h2>
          </div>

          {/* Decorative Divider Line */}
          <div className="w-24 h-[1px] bg-[#d4af37]/40 my-4"></div>

          {/* Story Paragraph */}
          <p className="font-['Playfair_Display',serif] text-[#beaca4] text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed tracking-wide max-w-[1000px] mx-auto italic">
            At La Divyn, we believe in the silent power of nature. Each gemstone
            is more than an ornament—it is a story, an energy, a timeless
            expression of elegance. Handpicked with care, our collection blends
            natural beauty with refined design, offering pieces that resonate
            with both style and soul.
          </p>

          {/* Bottom Space for Gemstone Rings in Background */}
          <div className="mt-20 sm:mt-32 md:mt-48">
            {/* 
              This empty div provides space to ensure the rings at the bottom of the 
              background image are fully visible on larger screens.
            */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
