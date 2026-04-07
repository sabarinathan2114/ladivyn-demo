import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import Button from "../common/Button";
import CheckoutModal from "./CheckoutModal";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleOrder = () => {
    setIsModalOpen(true);
  };

  const displayPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(parseInt(product.price.replace(/[^\d]/g, ""), 10) * quantity);

  return (
    <>
      <div className="flex flex-col items-center group h-full">
        {/* Image Container with aspect ratio */}
        <div className="w-full aspect-square mb-4 overflow-hidden bg-[#2a1721] rounded-sm transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer">
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
        <p className="font-['Montserrat',sans-serif] text-[#beaca4] text-xs sm:text-sm md:text-lg font-light mb-4 transition-all duration-300">
          {product.price}
        </p>

        {/* Quantity & Order Controls (pushed to the bottom using mt-auto) */}
        <div className="mt-auto grid grid-cols-[auto_1fr] gap-1 min-[400px]:gap-1.5 md:gap-2 pt-3 items-stretch">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between border border-[#8c7468]/50 rounded-full bg-[#0d0408] px-1 min-[400px]:px-1 md:px-2 w-[52px] min-[400px]:w-18 md:w-24">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              className="text-[#d4af37] hover:text-[#ebd162] hover:bg-[#d4af37]/10 p-0.5 min-[400px]:p-1 md:p-1.5 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Decrease quantity"
            >
              <FiMinus className="w-2.5 h-2.5 min-[400px]:w-3 min-[400px]:h-3 md:w-3.5 md:h-3.5" />
            </button>

            <span className="text-[#e6ddca] font-['Montserrat',sans-serif] text-[10px] min-[400px]:text-xs md:text-sm text-center select-none w-3 min-[400px]:w-4">
              {quantity}
            </span>

            <button
              onClick={increment}
              className="text-[#d4af37] hover:text-[#ebd162] hover:bg-[#d4af37]/10 p-0.5 min-[400px]:p-1 md:p-1.5 rounded-full transition-colors"
              aria-label="Increase quantity"
            >
              <FiPlus className="w-2.5 h-2.5 min-[400px]:w-3 min-[400px]:h-3 md:w-3.5 md:h-3.5" />
            </button>
          </div>

          {/* Order Now Button */}
          <Button
            onClick={handleOrder}
            className="w-full md:w-32 flex items-center justify-center py-1.5! md:py-2! px-1.6! min-[400px]:px-2! rounded-full! border! border-[#d4af37]! bg-transparent! text-[#d4af37]! font-['Cinzel',serif]! text-[10px]! min-[400px]:text-[11px]! md:text-xs! tracking-normal min-[400px]:tracking-wider md:tracking-widest font-semibold! transition-all duration-300 hover:bg-[#d4af37]! hover:text-[#170a10]! hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]! whitespace-nowrap"
          >
            ORDER<span className="hidden min-[350px]:inline">&nbsp;NOW</span>
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
          quantity={quantity}
          totalPrice={displayPrice}
        />
      )}
    </>
  );
};

export default ProductCard;
