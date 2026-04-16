import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GemstoneSection = () => {
  const navigate = useNavigate();
  const [btnPhase, setBtnPhase] = useState("idle");

  const AnimatedButton = ({
    children,
    onClick,
    className = "",
    phase,
    setPhase,
  }) => {
    return (
      <button
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${className}`}
        onMouseEnter={() => setPhase("enter")}
        onMouseLeave={() => setPhase("leave")}
        onClick={onClick}
      >
        <span
          className={`about-sweep ${
            phase === "enter"
              ? "sweep-ltr"
              : phase === "leave"
                ? "sweep-rtl"
                : ""
          }`}
        />
        <span className="relative z-10">{children}</span>
      </button>
    );
  };

  return (
    <section className="relative w-full py-14 sm:py-18 px-6 sm:px-8 flex flex-col items-center justify-center bg-[#0d0408] bg-[url('/images/crystalsection-bg.png')] bg-no-repeat bg-cover bg-left sm:bg-[position:85%_center] border-y border-[#4a343c]/60 overflow-hidden text-center ">
      {/* ── Keyframes + Styles for Button Animation ── */}
      <style>{`
        .about-sweep {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(212, 175, 55, 0.1) 30%,
            rgba(212, 175, 55, 0.3) 50%,
            rgba(212, 175, 55, 0.1) 70%,
            transparent 100%
          );
          transform: translateX(-130%);
          pointer-events: none;
        }

        .sweep-ltr {
          animation: sweepLTRAbout 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .sweep-rtl {
          animation: sweepRTLAbout 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes sweepLTRAbout {
          from { transform: translateX(-130%); }
          to   { transform: translateX(130%); }
        }

        @keyframes sweepRTLAbout {
          from { transform: translateX(130%); }
          to   { transform: translateX(-130%); }
        }
      `}</style>

      {/* Optional overlay for subtle depth */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center lg:items-center max-w-[90rem] mx-auto w-full">
        <h2 className="text-[#e1d4b7] text-2xl min-[320px]:text-3xl sm:text-4xl lg:text-[2.6rem] font-normal tracking-wider mb-6 font-['Playfair_Display',serif]">
          Understanding Gemstones
        </h2>
        <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-sm min-[320px]:text-base sm:text-lg lg:text-xl font-light mb-10 max-w-[600px] leading-relaxed">
          Discover the origins, composition, and timeless allure of nature's
          treasures.
        </p>
        <AnimatedButton
          phase={btnPhase}
          setPhase={setBtnPhase}
          className="bg-transparent border border-[#eeab5f8b] text-[#e1d4b7] font-['Playfair_Display',serif] normal-case px-6 py-2.5 sm:px-10 sm:py-3 text-base sm:text-lg tracking-widest font-light hover:bg-[#71300a]/10 hover:border-[#8a5e4d] transition-all duration-500 shadow-xl"
          onClick={() => navigate("/gemstones")}
        >
          Learn More
        </AnimatedButton>
      </div>
    </section>
  );
};

export default GemstoneSection;
