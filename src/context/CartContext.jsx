import { createContext, useContext, useEffect, useState } from "react";

// =============================
// Create Context
// =============================
const CartContext = createContext();

// =============================
// Custom Hook
// =============================
export const useCart = () => useContext(CartContext);

// =============================
// Provider Component
// =============================
export const CartProvider = ({ children }) => {
  // ✅ Load cart safely from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Cart parse error:", err);
      return [];
    }
  });

  // =============================
  // ✅ Persist cart to localStorage
  // =============================
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Cart save error:", err);
    }
  }, [cart]);

  // =============================
  // ✅ Add to Cart
  // =============================
  const addToCart = (product) => {
    if (!product?._id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // =============================
  // ✅ Remove from Cart
  // =============================
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // =============================
  // ✅ Update Quantity
  // =============================
  const updateQuantity = (id, quantity) => {
    const qty = Number(quantity);
    if (!id || qty < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // =============================
  // ✅ Clear Entire Cart
  // =============================
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); // 🔥 extra safety
  };

  // =============================
  // ✅ Calculations
  // =============================
  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  // =============================
  // Provider Value
  // =============================
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};