import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/products/ProductCard";
import Navbar from "../components/common/navbar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/products");
        const formatted = res.data.map((p) => {
          // Robust price string conversion
          const rawPrice = p.display_price || 0;
          const priceFormatted = "₹" + parseFloat(rawPrice).toLocaleString("en-IN");
          
          return {
            id: p.id,
            name: p.name || "Unnamed Gemstone",
            price: priceFormatted,
            image: p.primary_image 
              ? (p.primary_image.startsWith("http") ? p.primary_image : `http://localhost:5000${p.primary_image.startsWith("/") ? "" : "/"}${p.primary_image}`)
              : "https://placehold.co/400x400/2a1721/e6ddca?text=Gemstone",
            short_description: p.short_description || "",
          };
        });
        setProducts(formatted);
        setError(null);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Unable to discover our collection right now. Please try again soon.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#170a10] w-full pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 md:px-8 bg-cover bg-center bg-no-repeat overflow-hidden text-center text-[#F8F8F8] relative"
      style={{ backgroundImage: 'url("/images/productsection-bg.webp")' }}
    >
      <div className="absolute inset-0 z-0 bg-transparent sm:bg-transparent"></div>
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Headings */}
        <div className="mb-10 sm:mb-16 max-w-4xl">
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-tight mb-6 text-[#e1d4b7]">
            The LaDivyn Collection
          </h1>
          <p className="font-['Playfair_Display',serif] italic text-base sm:text-lg md:text-xl text-[#beaca4] tracking-wider px-2 max-w-3xl mx-auto leading-relaxed">
            A curated anthology of nature's finest masterpieces, where natural beauty meets refined design.
          </p>
        </div>

        {/* Decorative Divider - Fading Gradient Style */}
        <div className="w-full flex items-center justify-center mb-16 sm:mb-24 opacity-80">
          <div className="h-[1px] bg-[linear-gradient(to_left,rgba(212,175,55,0.5),transparent)] grow max-w-[400px]"></div>
          <span className="px-6 sm:px-10 font-['Cinzel',serif] text-[#d4af37] text-[10px] sm:text-xs tracking-[0.5em] whitespace-nowrap">
            {loading ? "SEARCHING VAULT..." : "✦ ALL PIECES ✦"}
          </span>
          <div className="h-[1px] bg-[linear-gradient(to_right,rgba(212,175,55,0.5),transparent)] grow max-w-[400px]"></div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="py-20 animate-pulse">
            <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-xl">Preparing the gems for display...</p>
          </div>
        )}

        {error && !loading && (
          <div className="py-20 px-4 bg-[#2a1721]/30 border border-red-500/20 rounded-sm max-w-2xl">
            <p className="font-['Playfair_Display',serif] text-red-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#d4af37] text-[#170a10] font-bold text-xs tracking-widest uppercase hover:bg-[#ebd162] transition-colors"
            >
              Retry Discovery
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-12 md:gap-y-16 w-full max-w-7xl px-2 md:px-0 place-items-center">
            {products.map((product) => (
              <div key={product.id} className="w-full max-w-[400px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
