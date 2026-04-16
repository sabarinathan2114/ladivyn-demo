import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("ladivyn_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ladivyn_cart", JSON.stringify(cart));
  }, [cart]);

  // Migration: Ensure images point to Port 5000 if they were old or relative
  useEffect(() => {
    const updatedCart = cart.map(item => {
      if (item.image && typeof item.image === 'string') {
        // Replace 5001 with 5000 or prepend 5000 to /uploads
        let newImg = item.image.replace('localhost:5001', 'localhost:5000');
        if (newImg.startsWith('/uploads')) {
          newImg = `http://localhost:5000${newImg}`;
        }
        if (newImg !== item.image) {
          return { ...item, image: newImg };
        }
      }
      return item;
    });

    if (JSON.stringify(updatedCart) !== JSON.stringify(cart)) {
      setCart(updatedCart);
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((acc, item) => {
    try {
      // Ensure price is treated as a string before using .replace
      const priceStr = String(item.price || "0");
      const price = parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0;
      return acc + price * (item.quantity || 1);
    } catch (err) {
      console.error("Price parsing error for item:", item, err);
      return acc;
    }
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
