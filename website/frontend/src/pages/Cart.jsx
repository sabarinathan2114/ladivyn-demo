import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import Button from "../components/common/Button";
import Navbar from "../components/common/navbar";
import CheckoutModal from "../components/products/CheckoutModal";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount, totalItems } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBulkCheckout, setIsBulkCheckout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderSingle = (product) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }
    setSelectedProduct(product);
    setIsBulkCheckout(false);
    setIsModalOpen(true);
  };

  const handleOrderAll = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${location.pathname}`);
      return;
    }
    setIsBulkCheckout(true);
    setIsModalOpen(true);
  };

  const formattedTotal = "₹" + totalAmount.toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-[#170a10] w-full pt-28 sm:pt-36 pb-32 px-4 md:px-8 relative overflow-x-hidden">
      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url("/images/productsection-bg.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <h1 className="font-['Cinzel',serif] text-2xl sm:text-4xl text-[#e6ddca] tracking-[0.2em] mb-4 uppercase">
            Your Selection
          </h1>
          <div className="h-[2px] w-24 bg-[#d4af37]"></div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-[fadeIn_0.6s_ease-out]">
            <div className="w-24 h-24 rounded-full bg-[#2a1721] flex items-center justify-center mb-6 border border-[#d4af37]/20">
              <FiShoppingBag className="w-10 h-10 text-[#beaca4] opacity-40" />
            </div>
            <p className="font-['Playfair_Display',serif] italic text-[#beaca4] text-lg mb-8">
              Your treasure chest is empty.
            </p>
            <a href="/product">
              <Button className="px-10! py-4! rounded-sm!">
                DISCOVER GEMS
              </Button>
            </a>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Cart Items Grid - 5 in a row on large screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1a0c13]/80 backdrop-blur-sm border border-[#4a343c]/40 rounded-sm overflow-hidden flex flex-col group hover:border-[#d4af37]/60 transition-all duration-300"
                >
                  {/* Top: Image Area */}
                  <div className="relative aspect-square bg-[#0d0408] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-[#170a10]/60 text-[#beaca4] hover:text-red-400 p-1.5 rounded-full border border-[#4a343c] backdrop-blur-sm"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom: Details & Controls */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-['Playfair_Display',serif] text-[#e6ddca] text-sm sm:text-base leading-tight mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#d4af37] font-bold text-sm mb-3">
                      {item.price}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#4a343c] rounded-full bg-[#0d0408] px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-[#beaca4] p-1 disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-[#e6ddca] w-6 text-center font-['Montserrat'] text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-[#beaca4] p-1"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleOrderSingle(item)}
                        className="w-full py-2! px-0! text-[10px]! rounded-full!"
                      >
                        ORDER NOW
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Foot CTA */}
            <div className="mt-12 sticky bottom-8 left-0 w-full z-20 animate-[slideUp_0.5s_ease-out]">
              <div className="bg-[#170a10] border border-[#d4af37] p-6 sm:p-8 rounded-sm shadow-[0_-20px_40px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-[#beaca4] text-xs uppercase tracking-[0.2em] mb-1 font-['Cinzel']">
                    Grand Total ({totalItems} items)
                  </p>
                  <p className="text-[#d4af37] text-3xl sm:text-4xl font-bold tracking-tight">
                    {formattedTotal}
                  </p>
                </div>

                <Button
                  onClick={handleOrderAll}
                  className="w-full sm:w-auto px-5! py-4! rounded-full! bg-[#d4af37]! text-[#170a10]! hover:bg-[#ebd162]! flex items-center justify-center gap-3 text-sm! tracking-[0.2em] font-bold!"
                >
                  ORDER ALL
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal Integration */}
      {isModalOpen && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={isBulkCheckout ? null : selectedProduct}
          products={isBulkCheckout ? cart : null}
          quantity={isBulkCheckout ? null : selectedProduct?.quantity}
          totalPrice={
            isBulkCheckout
              ? formattedTotal
              : selectedProduct
                ? "₹" +
                  (
                    parseInt(String(selectedProduct.price || "0").replace(/[^\d]/g, ""), 10) *
                    (selectedProduct.quantity || 1)
                  ).toLocaleString("en-IN")
                : "0"
          }
        />
      )}

      {/* Styles for animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d0408;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 2px;
        }
      `,
        }}
      />
    </div>
  );
};

export default Cart;
