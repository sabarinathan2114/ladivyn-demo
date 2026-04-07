import React, { useState } from "react";
import { FiX, FiCheckCircle } from "react-icons/fi";
import Button from "../common/Button";

const CheckoutModal = ({ isOpen, onClose, product, quantity, totalPrice }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setisProcessing] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error immediately on change if they try to fix it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";

    // Email validation: must contain @ and end with .com
    if (
      !formData.email.includes("@") ||
      !formData.email.toLowerCase().endsWith(".com")
    ) {
      newErrors.email = "Valid email Id is required.";
    }

    // Mobile validation: exactly 10 digits
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Mobile must be exactly 10 digits.";
    }

    // Address validation
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (!validate()) {
      e.preventDefault();
    }
    // If valid, the browser natively posts to FormSubmit.co
  };

  const handleClose = () => {
    // Reset the modal state whenever it closes
    setFormData({
      name: "",
      email: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out] text-left">
      {/* Click overlay to close */}
      <div className="absolute inset-0" onClick={handleClose}></div>

      <div className="relative w-full max-w-lg bg-[#170a10] border border-[#d4af37]/40 rounded-sm shadow-2xl max-h-[95vh] overflow-y-auto z-10 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Close Button X */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#beaca4] hover:text-[#d4af37] transition-colors z-20"
        >
          <FiX className="w-6 h-6" />
        </button>

        {isSubmitted ? (
          <div className="p-8 md:p-12 flex flex-col items-center text-center animate-[fadeInOffset_0.5s_ease-out]">
            <FiCheckCircle className="w-16 h-16 text-[#d4af37] mb-6" />
            <h2 className="text-[#e6ddca] text-2xl md:text-3xl font-['Playfair_Display',serif] mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-[#beaca4] font-['Montserrat',sans-serif] text-sm md:text-base leading-relaxed mb-8">
              Thank you for choosing LaDivyn. Your order for{" "}
              <strong className="text-[#d4af37]">
                {quantity}x {product.name}
              </strong>{" "}
              has been received. We will reach out to you shortly!
            </p>
            <Button onClick={handleClose} className="!px-8 !py-3 !rounded-sm">
              CONTINUE SHOPPING
            </Button>
          </div>
        ) : (
          <div className="p-4 sm:p-6 md:p-8">
            <h2 className="text-[#e6ddca] text-lg sm:text-xl md:text-2xl font-['Playfair_Display',serif] mb-4 sm:mb-6 tracking-wide border-b border-[#4a343c] pb-3 sm:pb-4">
              Complete Your Order
            </h2>

            {/* Order Summary Line */}
            <div className="flex items-center gap-3 sm:gap-4 bg-[#0d0408] p-3 sm:p-4 rounded-sm border border-[#d4af37]/20 mb-5 sm:mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-sm bg-[#2a1721] opacity-90"
              />
              <div className="flex-1">
                <h3 className="text-[#e6ddca] font-['Playfair_Display',serif] text-xs sm:text-sm md:text-base leading-tight">
                  {product.name}
                </h3>
                <p className="text-[#beaca4] text-[10px] sm:text-xs font-['Montserrat',sans-serif] mt-1">
                  Quantity: {quantity}
                </p>
                <p className="text-[#d4af37] text-xs sm:text-sm font-semibold tracking-wider mt-1">
                  {totalPrice}
                </p>
              </div>
            </div>

            <form
              action="https://formsubmit.co/sabarinathannachiappanctsv@gmail.com"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >
              {/* Hidden Fields for FormSubmit */}
              <input
                type="hidden"
                name="_subject"
                value={`New LaDivyn Order - ${formData.name}`}
              />
              <input type="hidden" name="Product Name" value={product.name} />
              <input type="hidden" name="Quantity" value={quantity} />
              <input type="hidden" name="Total Price" value={totalPrice} />
              <input
                type="hidden"
                name="Shipping Address"
                value={`${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}, ${formData.country}`}
              />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="text-[#d4af37] text-[10px] md:text-xs tracking-widest font-['Cinzel',serif] uppercase mb-2">
                  Personal Details
                </h4>

                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className={`w-full bg-[#0d0408] border ${errors.name ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-4 py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-sm transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mt-3 md:mt-0">
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      className={`w-full bg-[#0d0408] border ${errors.email ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-4 py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-sm transition-colors`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 md:mt-0">
                    <input
                      type="number"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Mobile Number (10 digits) *"
                      className={`w-full bg-[#0d0408] border ${errors.mobile ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-4 py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-sm transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                    {errors.mobile && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3 pt-5 mt-2 border-t border-[#4a343c]/40">
                <h4 className="text-[#d4af37] text-[10px] md:text-xs tracking-widest font-['Cinzel',serif] uppercase mb-2">
                  Shipping Address
                </h4>

                <div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street Address / Line 1 *"
                    className={`w-full bg-[#0d0408] border ${errors.address ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-4 py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-sm transition-colors`}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="mt-1 sm:mt-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City *"
                      className={`w-full bg-[#0d0408] border ${errors.city ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors`}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-3">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State *"
                      className={`w-full bg-[#0d0408] border ${errors.state ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors`}
                    />
                    {errors.state && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="mt-3 sm:mt-3">
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode *"
                      className={`w-full bg-[#0d0408] border ${errors.pincode ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors`}
                    />
                    {errors.pincode && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-3">
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country *"
                      className={`w-full bg-[#0d0408] border ${errors.country ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors`}
                    />
                    {errors.country && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 pb-2">
                <Button
                  disabled={isProcessing}
                  className="w-full py-3.5! rounded-sm! text-sm! tracking-[0.2em] font-semibold border-none !bg-[#d4bb59] !text-black hover:!bg-[#ebd162] hover:!text-black before:bg-[#ebd162]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
