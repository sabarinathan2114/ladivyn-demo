import React, { useState } from "react";

const HeroSection = () => {
  const [btnPhase, setBtnPhase] = useState("idle");

  return (
    <section className="relative w-full h-screen bg-[#0d0408] bg-[url('/images/herosection-bg.png')] bg-cover bg-center bg-no-repeat overflow-hidden border-b border-[#8c7468]/50">
      {/* Dark left-side vignette */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(6,1,6,0.85)_0%,rgba(6,1,6,0.50)_45%,transparent_75%)] pointer-events-none" />

      {/* ── Logo & Subtitle: Perfectly Centered Top ── */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center z-10 top-[8%]">
        <div
          style={{
            animation:
              "fadeInDown 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
          }}
        >
          <img
            src="/images/logo.png"
            alt="La Divyn - Curated by Mobe"
            className="w-[90vw] max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>

      {/* ── Content: Centered on Mobile/Tab, Shifted Left on Desktop ── */}
      <div className="absolute left-1/2 -translate-x-1/2 lg:left-[35%] z-10 bottom-[12%] w-full max-w-[90vw] sm:max-w-[600px] lg:max-w-[640px] px-4 md:px-6">
        <div
          className="flex flex-col items-center text-center"
          style={{ animation: "fadeInUp 1.4s ease both" }}
        >
          {/* Headings */}
          <h2 className="text-[1.6rem] sm:text-[2.2rem] lg:text-[2.8rem] text-[#F5EDE0] m-0 font-normal leading-tight font-serif">
            Rooted in Nature.
          </h2>
          <h2 className="text-[1.4rem] sm:text-[2rem] lg:text-[2.4rem] italic text-[#d5cabd] m-0 font-normal leading-tight mb-5 md:mb-6 font-serif">
            Crafted for Timeless Elegance.
          </h2>

          {/* Paragraph */}
          <p className="text-[0.75rem] sm:text-[0.85rem] lg:text-[0.9rem] text-[#ffffff]/90 leading-relaxed font-light mb-8 md:mb-10 max-w-[700px] font-sans">
            Discover the quiet luxury of natural crystals and gemstones - each
            piece thoughtfully crafted with intention - to complement not just
            your style, but your presence.
          </p>

          {/* ── CTA Button ── */}
          <button
            className="relative inline-flex items-center justify-center overflow-hidden px-10 py-2.5 sm:px-14 sm:py-3 bg-[#0a0303]/60 border border-[#9B7A42] outline-none cursor-pointer transition-all duration-400 hover:border-[#C9A96E] hover:bg-[#140604]/72 group active:scale-95"
            onMouseEnter={() => setBtnPhase("enter")}
            onMouseLeave={() => setBtnPhase("leave")}
            onClick={() => console.log("Explore clicked")}
          >
            {/* Golden shadow sweep layer */}
            <span
              className={`absolute inset-0 z-0 pointer-events-none -translate-x-[130%] bg-[linear-gradient(to_right,transparent_0%,rgba(212,175,55,0.12)_30%,rgba(212,175,55,0.38)_50%,rgba(212,175,55,0.12)_70%,transparent_100%)] ${
                btnPhase === "enter"
                  ? "sweep-ltr"
                  : btnPhase === "leave"
                    ? "sweep-rtl"
                    : ""
              }`}
            />
            <span className="relative z-10 font-serif text-[0.95rem] lg:text-[1.05rem] tracking-[0.12em] font-normal text-[#D9C5A0] group-hover:text-[#F0DDB8] transition-colors duration-350 pointer-events-none">
              Explore Collection
            </span>
          </button>
        </div>
      </div>

      {/* Keyframes + Styles */}
      <style>{`
        @keyframes fadeInDown {
          0%   { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Hover: sweep left → right */
        .sweep-ltr {
          animation: sweepLTR 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Mouse-leave: sweep right → left */
        .sweep-rtl {
          animation: sweepRTL 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes sweepLTR {
          from { transform: translateX(-130%); }
          to   { transform: translateX(130%); }
        }

        @keyframes sweepRTL {
          from { transform: translateX(130%); }
          to   { transform: translateX(-130%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
