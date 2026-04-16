import React from "react";
import Navbar from "../components/common/navbar";

const Guide = () => {
  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#170a10] text-[#F8F8F8] font-['Playfair_Display',serif] lg:overflow-hidden">
      <Navbar />

      {/* Hero Section - Content pinned to top 10% for LG screens */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-start pt-[20%] sm:pt-[15%] lg:pt-[7%] px-6 sm:px-10 bg-[url('/images/whitegemstone.png')] bg-cover bg-top bg-no-repeat lg:overflow-hidden">
        {/* Subtle overlay to enhance text legibility */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        <div className="relative z-10 max-w-[90rem] w-full text-center flex flex-col items-center">
          {/* Main Title Group */}
          <div className="mb-4 lg:mb-6">
            <p className="text-[#71300a] text-[10px] sm:text-xs lg:text-[13px] uppercase tracking-[0.5em] mb-2 opacity-70 font-bold">
              Our Philosophy
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[4rem] font-normal tracking-wide text-[#60390d] leading-tight">
              Where Beauty Meets Meaning
            </h1>
          </div>

          {/* Intro Text for List */}
          <p className="text-[#71300a] text-base sm:text-lg md:text-xl lg:text-[1.4rem] font-light mb-3 opacity-90">
            We curate crystals and gemstones that are:
          </p>

          {/* Value List Group */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 lg:gap-3 mb-4 sm:mb-8 lg:mb-10">
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-[#71300a]/60"></span>
              <p className="text-[#71300a] text-lg sm:text-xl lg:text-[1.6rem] font-normal italic tracking-wide">
                Ethically sourced
              </p>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-[#71300a]/60"></span>
              <p className="text-[#71300a] text-lg sm:text-xl lg:text-[1.6rem] font-normal italic tracking-wide">
                Naturally powerful
              </p>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-[#71300a]/60"></span>
              <p className="text-[#71300a] text-lg sm:text-xl lg:text-[1.6rem] font-normal italic tracking-wide">
                Designed for modern living
              </p>
            </div>
          </div>

          {/* Footer Statement */}
          <div className="space-y-1 sm:space-y-3 px-4">
            <p className="font-['Playfair_Display',serif] text-[#4d2610] text-sm sm:text-lg lg:text-[1.4rem] font-light leading-relaxed tracking-wide max-w-[90rem] mx-auto opacity-90">
              Every piece is chosen not just for how it looks - but for how it
              makes you feel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;
