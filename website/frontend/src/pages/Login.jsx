import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Navbar from "../components/common/navbar";
import { FiMail, FiLock, FiAlertCircle, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from the query string (e.g., /login?redirect=/cart)
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

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
                Welcome Back
              </h1>
              <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-sm sm:text-base">
                Sign in to continue your collection journey.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-3 text-red-400 text-sm">
                <FiAlertCircle className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-['Cinzel'] text-[10px] tracking-widest text-[#d4af37] uppercase mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#beaca4]/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0d0408]/50 border border-[#4a343c] focus:border-[#d4af37] text-[#e6ddca] px-12 py-3.5 rounded-sm outline-none transition-all duration-300 font-['Montserrat'] text-sm"
                    placeholder="Enter your email"
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0d0408]/50 border border-[#4a343c] focus:border-[#d4af37] text-[#e6ddca] px-12 py-3.5 rounded-sm outline-none transition-all duration-300 font-['Montserrat'] text-sm"
                    placeholder="Enter your password"
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

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full py-4! rounded-sm! flex items-center justify-center gap-3"
                  disabled={loading}
                >
                  {loading ? "AUTHENTICATING..." : "SIGN IN"}
                  {!loading && <FiArrowRight />}
                </Button>
              </div>
            </form>

            <div className="mt-10 text-center border-t border-[#4a343c] pt-8">
              <p className="text-[#beaca4] text-xs sm:text-sm font-['Montserrat'] mb-4">
                Don't have an account yet?
              </p>
              <Link 
                to={`/register${location.search}`}
                className="font-['Cinzel'] text-[10px] tracking-[0.2em] text-[#d4af37] hover:text-[#ebd162] transition-colors uppercase font-bold"
              >
                Create an Account
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

export default Login;
