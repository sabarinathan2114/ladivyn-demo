import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import {
  FiInstagram,
  FiMenu,
  FiX,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Collection", href: "/product" },
    { name: "Gemstone guide", href: "/guide" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#1a0a0e]/90 backdrop-blur-md border-b border-[#8c7468]/20">
        <div className="w-full px-6 sm:px-10 md:px-14">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo — left */}
            <Link to="/" className="flex-shrink-0 group">
              <img
                src="/images/logo.png"
                alt="La Divyn"
                className="h-8 sm:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
            </Link>

            {/* Desktop Nav — centered */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative font-['Cinzel',serif] text-[#c9a96e] text-[12px] xl:text-[13px] tracking-[0.15em] xl:tracking-[0.18em] hover:text-[#e8d5a8] transition-colors duration-300 group whitespace-nowrap"
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[1px] bg-[#c9a96e]/70 transition-all duration-300 group-hover:w-full ${
                      isActive(link.href) ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Icons — right */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="#"
                className="text-[#c9a96e] hover:text-[#e8d5a8] transition-all duration-300 hover:scale-110"
              >
                <FiInstagram size={18} />
              </a>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative group/user">
                    <button
                      className="text-[#c9a96e] hover:text-[#e8d5a8] transition-all duration-300 flex items-center gap-2"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    >
                      <FiUser size={18} />
                      <span className="text-[10px] tracking-widest uppercase font-['Cinzel'] hidden xl:inline">
                        {user?.name?.split(" ")[0]}
                      </span>
                    </button>

                    {/* User Dropdown */}
                    <div className="absolute top-full right-0 mt-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-2 group-hover/user:translate-y-0 z-[100]">
                      <div className="bg-[#170a10] border border-[#d4af37]/30 p-4 rounded-sm shadow-2xl min-w-[160px]">
                        <p className="text-[#beaca4] text-[10px] uppercase tracking-widest mb-3 pb-2 border-b border-[#4a343c]">
                          Profile
                        </p>
                        <a
                          href="/profile"
                          className="flex items-center gap-2 text-[#c9a96e] hover:text-[#e8d5a8] transition-colors text-[11px] tracking-widest uppercase font-['Cinzel'] w-full mb-3"
                        >
                          <FiSettings size={14} /> Account
                        </a>
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 text-[#c9a96e] hover:text-red-400 transition-colors text-[11px] tracking-widest uppercase font-['Cinzel'] w-full"
                        >
                          <FiLogOut size={14} /> Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <a
                    href="/login"
                    className="text-[#c9a96e] hover:text-[#e8d5a8] transition-all duration-300 hover:scale-110"
                    title="Account Login"
                  >
                    <FiUser size={18} />
                  </a>
                )}
              </div>

              <div className="h-4 w-[1px] bg-[#c9a96e]/25"></div>

              {/* Cart Icon */}
              <div className="relative">
                <a
                  href="/cart"
                  className="text-[#c9a96e] hover:text-[#e8d5a8] transition-all duration-300 hover:scale-110 block relative"
                >
                  <FiShoppingBag size={18} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d4af37] text-[#170a10] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </a>
              </div>
            </div>

            {/* Mobile Actions — right */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Cart Icon Mobile */}
              <div className="relative">
                <a
                  href="/cart"
                  className="text-[#c9a96e] hover:text-[#e8d5a8] transition-all duration-300 active:scale-90 block relative p-2"
                >
                  <FiShoppingBag size={22} />
                  {totalItems > 0 && (
                    <span className="absolute top-1 right-1 bg-[#d4af37] text-[#170a10] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="text-[#c9a96e] p-2 transition-transform active:scale-95"
                onClick={() => setMobileOpen(true)}
              >
                <FiMenu size={26} />
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-night/95 backdrop-blur-xl transition-all duration-500 ease-in-out lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-6 sm:p-8">
          <div className="flex justify-between items-center mb-10 sm:mb-16">
            <img src="/images/logo.png" alt="Logo" className="h-8 min-[320px]:h-9 sm:h-10 w-auto" />
            <button
              onClick={() => setMobileOpen(false)}
              className="text-aurum p-1.5 sm:p-2"
            >
              <FiX size={28} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 sm:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-display text-aurum text-lg min-[320px]:text-xl sm:text-2xl tracking-widest hover:text-accent-gold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {!isAuthenticated && (
              <a
                href="/login"
                className="font-display text-[#d4af37] text-lg min-[320px]:text-xl sm:text-2xl tracking-widest hover:text-accent-gold mt-2 sm:mt-4 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Login / Register
              </a>
            )}
          </nav>

          {isAuthenticated && (
            <div className="mt-auto pt-10 border-t border-aurum/10">
              <p className="text-[#beaca4] text-xs uppercase tracking-widest mb-4">
                Logged in as {user?.name}
              </p>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 text-aurum text-xl tracking-widest"
              >
                <FiLogOut /> LOG OUT
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-auto pt-10 border-t border-aurum/10 flex gap-8">
              <a href="#" className="text-aurum">
                <FiInstagram size={24} />
              </a>
              <a href="/cart" className="text-aurum relative">
                <FiShoppingBag size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-[#170a10] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
