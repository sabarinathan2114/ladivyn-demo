import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Rose Quartz Bracelet",
    price: "₹2,800",
    image: "/images/products/rose-quartz-bracelet.png",
  },
  {
    id: 2,
    name: "Amethyst Cluster",
    price: "₹3,500",
    image: "/images/products/amethyst-cluster.png",
  },
  {
    id: 3,
    name: "Aquamarine Pendant",
    price: "₹2,200",
    image: "/images/products/aquamarine-pendant.png",
  },
  {
    id: 4,
    name: "Citrine Crystal",
    price: "₹2,600",
    image: "/images/products/citrine-crystal.png",
  },
];

const ProductSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-12 sm:py-20 px-4 md:px-8 bg-[#170a10] bg-[url('/images/aboutsection-bg.png')] bg-cover md:bg-size-[100%_100%] bg-bottom bg-no-repeat overflow-hidden text-center text-[#F8F8F8] border-b border-[#8c7468]/50">
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 z-0 bg-[#1e0a13]/60 sm:bg-transparent"></div>
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Headings */}
        <div className="mb-8 sm:mb-12 max-w-6xl">
          <h2 className="font-['Playfair_Display',serif] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4 text-[#e6ddca]">
            Elements of the Earth, Cultivated for the Modern World.
          </h2>
          <p className="font-['Playfair_Display',serif] italic text-xs sm:text-sm md:text-base lg:text-lg text-[#beaca4] tracking-wide px-2">
            Experience the beauty and balance of natural gemstones, thoughtfully
            curated.
          </p>
        </div>

        {/* Divider with Text */}
        <div className="w-full flex items-center justify-center mb-10 max-w-5xl">
          <div className="h-[2px] bg-[#8c7468] flex-grow opacity-80"></div>
          <span className="px-3 sm:px-6 font-['Cinzel',serif] font-bold text-[#e6ddca] text-[10px] sm:text-xs md:text-base tracking-[0.2em] whitespace-nowrap">
            FEATURED GEMS
          </span>
          <div className="h-[2px] bg-[#8c7468] flex-grow opacity-80"></div>
        </div>

        <div className="flex items-center justify-between w-full max-w-[1600px] mt-4 px-2 md:px-8">
          <div className="w-14 md:w-20 shrink-0 hidden xl:block"></div>{" "}
          {/* Left Spacer for absolute center balance */}
          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12 w-full max-w-6xl mx-auto z-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Image Container with aspect ratio */}
                <div className="w-full aspect-square mb-6 overflow-hidden bg-[#2a1721] rounded-sm transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x400/2a1721/e6ddca?text=Gemstone";
                    }}
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-['Playfair_Display',serif] text-[#e6ddca] text-sm sm:text-base md:text-xl font-normal mb-1 md:mb-2 tracking-wide group-hover:text-[#F9D423] transition-colors duration-300 text-center leading-tight">
                  {product.name}
                </h3>
                <p className="font-['Montserrat',sans-serif] text-[#beaca4] text-xs sm:text-sm md:text-lg font-light">
                  {product.price}
                </p>
              </div>
            ))}
          </div>
          {/* View All Products Arrow Button (Desktop - Far Right) */}
          <div className="hidden xl:flex w-14 md:w-20 shrink-0 justify-end z-20">
            <button
              onClick={() => navigate("/product")}
              className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#d4af37] bg-transparent text-[#d4af37] transition-all duration-300 hover:bg-[#d4af37] hover:text-[#170a10] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              <FiChevronRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-1" />

              {/* Tooltip that appears on hover */}
              <span className="absolute xl:-top-10 xl:-left-10 lg:-top-12 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 bg-black/80 text-[#e6ddca] text-xs px-3 py-1.5 rounded font-['Montserrat',sans-serif] whitespace-nowrap tracking-wide border border-[#d4af37]/40 pointer-events-none z-50">
                View Product Page
              </span>
            </button>
          </div>
        </div>

        {/* View All Products Arrow Button (Mobile/Tablet - Below Grid) */}
        <div className="mt-12 flex xl:hidden justify-center shrink-0 w-full z-20">
          <button
            onClick={() => navigate("/product")}
            className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#d4af37] bg-transparent text-[#d4af37] transition-all duration-300 hover:bg-[#d4af37] hover:text-[#170a10] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            <FiChevronRight className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-1" />

            {/* Tooltip that appears on hover */}
            <span className="absolute -top-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 bg-black/80 text-[#e6ddca] text-xs px-3 py-1.5 rounded font-['Montserrat',sans-serif] whitespace-nowrap tracking-wide border border-[#d4af37]/40 pointer-events-none z-50">
              View Product Page
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
