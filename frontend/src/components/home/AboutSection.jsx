import React from "react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col text-[#F8F8F8] font-['Playfair_Display',serif]">
      {/* Understanding Gemstones Block */}
      <section className="relative w-full py-24 px-4 flex flex-col items-center justify-center bg-[#0d0408] bg-[url('/images/crystalsection-bg.webp')] bg-cover md:bg-size-[100%_100%] bg-center bg-no-repeat border-b border-[#4a343c] overflow-hidden text-center">
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          <h2 className="text-[#e6ddca] text-3xl md:text-4xl font-normal tracking-wide mb-4 font-['Playfair_Display',serif]">
            Understanding Gemstones
          </h2>
          <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-base md:text-xl font-light mb-10 max-w-2xl px-4">
            Discover the origins, composition, and timeless allure of nature's
            treasures.
          </p>
          <Button onClick={() => console.log("Learn More clicked")}>
            Learn More
          </Button>
        </div>
      </section>

      {/* About LaDivyn Block */}
      <section className="relative w-full py-24 px-4 flex flex-col items-center justify-center bg-[#170a10] bg-[url('/images/aboutsection-bg.webp')] bg-cover md:bg-size-[100%_100%] bg-center bg-no-repeat overflow-hidden text-center">
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          <h2 className="text-[#e6ddca] text-3xl md:text-4xl font-normal tracking-wide mb-6 font-['Playfair_Display',serif]">
            About LaDivyn
          </h2>
          <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-base md:text-xl font-light mb-10 max-w-2xl px-4 leading-relaxed tracking-wide">
            Inspired by the enduring beauty of the earth, we create pieces that
            <br className="hidden md:block" /> connect the natural and the
            refined.
          </p>
          <Button onClick={() => navigate("/product")}>Shop Now</Button>
        </div>

        {/* Decorative Star Divider at bottom */}
        <div className="relative z-10 w-full flex items-center justify-center max-w-3xl mt-20 opacity-80">
          <div className="h-[1px] bg-[#665249] grow"></div>
          <span className="px-6 text-[#d4af37] text-sm tracking-[0.5em] flex gap-2">
            ✦ ✦
          </span>
          <div className="h-[1px] bg-[#665249] grow"></div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
