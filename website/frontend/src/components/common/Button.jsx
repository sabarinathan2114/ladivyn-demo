import React from "react";

const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-5 py-2.5
        text-[#170A10] font-['Montserrat',sans-serif] text-xs tracking-[0.2em] font-bold uppercase
        bg-[#D4AF37]
        border border-[#D4AF37]
        cursor-pointer transition-all duration-300
        hover:bg-[#ebd162] hover:border-[#ebd162]
        active:scale-95
        group ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
