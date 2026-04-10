import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Navbar from "../components/common/navbar";
import { FiUser, FiMail, FiLock, FiPhone, FiAlertCircle, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from the query string
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect") || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic mobile validation
    if (formData.mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0408] relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'url("/images/productsection-bg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10 pt-24 sm:pt-32">
        <div className="w-full max-w-md animate-[fadeIn_0.8s_ease-out]">
          {/* Form Card */}
          <div className="bg-[#1a0c13]/80 backdrop-blur-xl border border-[#d4af37]/20 p-8 sm:p-10 rounded-sm shadow-2xl">
            <div className="text-center mb-10">
              <h1 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#e6ddca] tracking-[0.2em] mb-4 uppercase">
                Create Account
              </h1>
              <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-sm sm:text-base">
                Join LaDivyn and curator of fine gemstones.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-3 text-red-400 text-sm">
                <FiAlertCircle className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-['Cinzel'] text-[10px] tracking-widest text-[#d4af37] uppercase mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#beaca4]/40" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#0d0408]/50 border border-[#4a343c] focus:border-[#d4af37] text-[#e6ddca] px-12 py-3 rounded-sm outline-none transition-all duration-300 font-['Montserrat'] text-sm"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block font-['Cinzel'] text-[10px] tracking-widest text-[#d4af37] uppercase mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#beaca4]/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0d0408]/50 border border-[#4a343c] focus:border-[#d4af37] text-[#e6ddca] px-12 py-3 rounded-sm outline-none transition-all duration-300 font-['Montserrat'] text-sm"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-['Cinzel'] text-[10px] tracking-widest text-[#d4af37] uppercase mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#beaca4]/40" />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full bg-[#0d0408]/50 border border-[#4a343c] focus:border-[#d4af37] text-[#e6ddca] px-12 py-3 rounded-sm outline-none transition-all duration-300 font-['Montserrat'] text-sm"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div>
                <label className="block font-['Cinzel'] text-[10px] tracking-widest text-[#d4af37] uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#beaca4]/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#0d0408]/50 border border-[#4a343c] focus:border-[#d4af37] text-[#e6ddca] px-12 py-3 rounded-sm outline-none transition-all duration-300 font-['Montserrat'] text-sm"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#beaca4]/60 hover:text-[#d4af37] transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full py-4! rounded-sm! flex items-center justify-center gap-3"
                  disabled={loading}
                >
                  {loading ? "CREATING ACCOUNT..." : "REGISTER NOW"}
                  {!loading && <FiArrowRight />}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-[#4a343c] pt-6">
              <p className="text-[#beaca4] text-xs font-['Montserrat'] mb-3">
                Already have an account?
              </p>
              <Link 
                to={`/login${location.search}`}
                className="font-['Cinzel'] text-[10px] tracking-[0.2em] text-[#d4af37] hover:text-[#ebd162] transition-colors uppercase font-bold"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default Register;
