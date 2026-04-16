import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiCheckCircle } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

const CheckoutModal = ({
  isOpen,
  onClose,
  product,
  quantity,
  totalPrice,
  products = null,
}) => {
  const { clearCart, removeFromCart } = useCart();
  // If products is provided, we are checking out the whole cart
  const isMultiProduct = !!products && products.length > 0;

  const displayProducts = isMultiProduct ? (products || []) : (product ? [product] : []);
  const displayQuantity = isMultiProduct
    ? (products || []).reduce((acc, p) => acc + (p.quantity || 0), 0)
    : quantity;
  const displayTotal = isMultiProduct
    ? "₹" +
      products
        .reduce((acc, p) => {
          const pPrice = parseInt(p.price.replace(/[^\d]/g, ""), 10);
          return acc + pPrice * p.quantity;
        }, 0)
        .toLocaleString("en-IN")
    : totalPrice;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [locationMasters, setLocationMasters] = useState({
    states: [],
    districts: [],
    cities: [],
    pincodes: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setisProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStates();
    }
  }, [isOpen]);

  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations/states");
      setLocationMasters((prev) => ({ ...prev, states: res.data }));
    } catch (err) {}
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    const stateName =
      locationMasters.states.find((s) => s.id == stateId)?.name || "";
    setFormData((prev) => ({
      ...prev,
      state: stateName,
      district: "",
      city: "",
      pincode: "",
    }));
    setLocationMasters((prev) => ({
      ...prev,
      districts: [],
      cities: [],
      pincodes: [],
    }));

    if (stateId) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/locations/states/${stateId}/districts`,
        );
        setLocationMasters((prev) => ({ ...prev, districts: res.data }));
      } catch (err) {}
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    const districtName =
      locationMasters.districts.find((d) => d.id == districtId)?.name || "";
    setFormData((prev) => ({
      ...prev,
      district: districtName,
      city: "",
      pincode: "",
    }));
    setLocationMasters((prev) => ({ ...prev, cities: [], pincodes: [] }));

    if (districtId) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/locations/districts/${districtId}/cities`,
        );
        setLocationMasters((prev) => ({ ...prev, cities: res.data }));
      } catch (err) {}
    }
  };

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    const cityName =
      locationMasters.cities.find((c) => c.id == cityId)?.name || "";
    setFormData((prev) => ({ ...prev, city: cityName, pincode: "" }));
    setLocationMasters((prev) => ({ ...prev, pincodes: [] }));

    if (cityId) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/locations/cities/${cityId}/pincodes`,
        );
        setLocationMasters((prev) => ({ ...prev, pincodes: res.data }));
      } catch (err) {}
    }
  };

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
    if (!formData.district.trim()) newErrors.district = "District is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setisProcessing(true);
    try {
      const orderData = {
        total_amount: parseInt(displayTotal.replace(/[^\d]/g, ""), 10),
        items: displayProducts.map((p) => ({
          product_id: p.id,
          quantity: isMultiProduct ? p.quantity : quantity,
          price: p.price,
        })),
        address_details: {
          customer_name: formData.name,
          address: formData.address,
          mobile: formData.mobile,
          email: formData.email,
          state: formData.state,
          district: formData.district,
          city: formData.city,
          pincode: formData.pincode,
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
      );

      if (res.data.success) {
        setIsSubmitted(true);
        // Clear cart based on checkout type
        if (isMultiProduct) {
          clearCart();
        } else {
          removeFromCart(product.id);
        }
      }
    } catch (err) {
      console.error("Checkout submission failed:", err);
      const serverMessage =
        err.response?.data?.message ||
        "There was an issue processing your order.";
      const detail = err.response?.data?.error
        ? `\n\nDetail: ${err.response.data.error}`
        : "";

      alert(
        `${serverMessage}${detail}\n\nPlease contact support if this persists.`,
      );
    } finally {
      setisProcessing(false);
    }
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
                {isMultiProduct
                  ? `${displayQuantity} items`
                  : `${quantity}x ${product?.name || "Product"}`}
              </strong>{" "}
              has been received. We will reach out to you shortly!
            </p>
            <Button onClick={handleClose} className="px-8! py-3! rounded-sm!">
              CONTINUE SHOPPING
            </Button>
          </div>
        ) : (
          <div className="p-4 sm:p-6 md:p-8">
            <h2 className="text-[#e6ddca] text-lg sm:text-xl md:text-2xl font-['Playfair_Display',serif] mb-4 sm:mb-6 tracking-wide border-b border-[#4a343c] pb-3 sm:pb-4">
              Complete Your Order
            </h2>

            {/* Order Summary Section */}
            <div className="bg-[#0d0408] p-3 sm:p-4 rounded-sm border border-[#d4af37]/20 mb-5 sm:mb-6 max-h-48 overflow-y-auto custom-scrollbar">
              {displayProducts.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className={`flex items-center gap-3 sm:gap-4 ${idx !== 0 ? "mt-4 pt-4 border-t border-[#4a343c]/30" : ""}`}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-sm bg-[#2a1721] opacity-90"
                  />
                  <div className="flex-1">
                    <h3 className="text-[#e6ddca] font-['Playfair_Display',serif] text-xs sm:text-sm leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-[#beaca4] text-[10px] sm:text-xs font-['Montserrat',sans-serif] mt-1">
                      Quantity: {isMultiProduct ? p.quantity : quantity}
                    </p>
                    <p className="text-[#d4af37] text-xs font-semibold tracking-wider mt-0.5">
                      {p.price}
                    </p>
                  </div>
                </div>
              ))}

              {isMultiProduct && (
                <div className="mt-4 pt-4 border-t border-[#d4af37]/40 flex justify-between items-center">
                  <span className="text-[#beaca4] text-xs uppercase tracking-widest font-['Cinzel']">
                    Total Amount
                  </span>
                  <span className="text-[#d4af37] text-lg font-bold">
                    {displayTotal}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                    <select
                      name="state"
                      value={
                        locationMasters.states.find(
                          (s) => s.name === formData.state,
                        )?.id || ""
                      }
                      onChange={handleStateChange}
                      className={`w-full bg-[#0d0408] border ${errors.state ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors`}
                    >
                      <option value="">Select State *</option>
                      {locationMasters.states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-3">
                    <select
                      name="district"
                      value={
                        locationMasters.districts.find(
                          (d) => d.name === formData.district,
                        )?.id || ""
                      }
                      onChange={handleDistrictChange}
                      disabled={!formData.state}
                      className={`w-full bg-[#0d0408] border ${errors.district ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors disabled:opacity-50`}
                    >
                      <option value="">Select District *</option>
                      {locationMasters.districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.district}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="mt-3 sm:mt-3">
                    <select
                      name="city"
                      value={
                        locationMasters.cities.find(
                          (c) => c.name === formData.city,
                        )?.id || ""
                      }
                      onChange={handleCityChange}
                      disabled={!formData.district}
                      className={`w-full bg-[#0d0408] border ${errors.city ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors disabled:opacity-50`}
                    >
                      <option value="">Select City / Town *</option>
                      {locationMasters.cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-3">
                    <select
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      disabled={!formData.city}
                      className={`w-full bg-[#0d0408] border ${errors.pincode ? "border-red-500/60" : "border-[#4a343c]"} text-[#e6ddca] px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm focus:border-[#d4af37] focus:outline-none placeholder:text-[#665249] font-['Montserrat',sans-serif] text-xs sm:text-sm transition-colors disabled:opacity-50`}
                    >
                      <option value="">Select Pincode *</option>
                      {locationMasters.pincodes.map((p) => (
                        <option key={p.id} value={p.pincode}>
                          {p.pincode}
                        </option>
                      ))}
                    </select>
                    {errors.pincode && (
                      <p className="text-red-400 text-[10px] sm:text-xs mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 pb-2">
                <Button
                  disabled={isProcessing}
                  className="w-full py-3.5! rounded-sm! text-sm! tracking-[0.2em] font-semibold border-none bg-[#d4bb59]! text-black! hover:!bg-[#ebd162]! hover:!text-black! before:bg-[#ebd162]/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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
