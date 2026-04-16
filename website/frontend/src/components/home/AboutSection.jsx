import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
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
        {/* Golden shadow sweep layer */}
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
    <div className="w-full flex flex-col text-[#F8F8F8] font-['Playfair_Display',serif]">
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

      {/* About LaDivyn Block */}
      <section className="relative w-full py-14 sm:py-20 px-6 flex flex-col items-center justify-center bg-[#170a10] bg-[url('/images/aboutsection-bg.png')] bg-cover bg-center bg-no-repeat overflow-hidden text-center border-none">
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center max-w-[90rem] mx-auto w-full">
          <h2 className="text-[#e1d4b7] text-2xl sm:text-4xl md:text-[2.8rem] font-normal tracking-[0.1em] mb-10 font-['Playfair_Display',serif]">
            About LaDivyn
          </h2>

          {/* Top Golden Line */}
          <div className="w-full max-w-[180px] sm:max-w-[280px] h-[1px] bg-[linear-gradient(to_right,transparent,rgba(212,175,55,0.4),transparent)] mb-6"></div>

          <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-base sm:text-lg md:text-xl font-light mb-10 max-w-[850px] px-2 leading-relaxed tracking-wide">
            Inspired by the enduring beauty of the earth, we create pieces that
            connect the natural and the refined.
          </p>

          <AnimatedButton
            phase={btnPhase}
            setPhase={setBtnPhase}
            className="bg-transparent border border-[#eeab5f8b] text-[#e1d4b7] font-['Playfair_Display',serif] normal-case px-6 py-2.5 sm:px-10 sm:py-3 text-base sm:text-lg tracking-widest font-light hover:bg-[#71300a]/10 hover:border-[#8a5e4d] transition-all duration-500 shadow-xl"
            onClick={() => navigate("/product")}
          >
            Shop Now
          </AnimatedButton>
        </div>

        {/* Decorative Divider at bottom - Exactly like UI */}
        <div className="relative z-10 w-full flex items-center justify-center mt-4 sm:mt-10 opacity-70">
          <div className="h-[1px] bg-[linear-gradient(to_left,rgba(212,175,55,0.5),transparent)] grow max-w-[400px]"></div>
          <span className="px-6 sm:px-10 text-[#d4af37] text-xs sm:text-sm tracking-[0.5em] flex gap-2">
            ✦ ✦
          </span>
          <div className="h-[1px] bg-[linear-gradient(to_right,rgba(212,175,55,0.5),transparent)] grow max-w-[400px]"></div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
