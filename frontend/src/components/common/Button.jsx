import React from 'react';

const Button = ({ children, onClick, className = '' }) => {
  return (
    <button 
      className={`group relative overflow-hidden bg-transparent text-white border border-[#d4af37]/60 px-8 py-3 font-['Montserrat',sans-serif] text-[0.9rem] tracking-[1px] uppercase cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#d4af37]/10 hover:border-[#d4af37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] ${className}`} 
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-[#d4af37]/20 to-transparent -translate-x-full transition-transform duration-700 ease-in-out group-hover:translate-x-full"></div>
    </button>
  );
};

export default Button;
