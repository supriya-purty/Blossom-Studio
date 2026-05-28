import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("blossomCart") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("blossomWishlist") || "[]"));

  const persist = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem("blossomCart", JSON.stringify(nextItems));
  };

  const addToCart = (product, quantity = 1) => {
    const existing = items.find((item) => item._id === product._id);
    const nextItems = existing
      ? items.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        )
      : [...items, { ...product, quantity }];
    persist(nextItems);
  };

  const updateQuantity = (id, quantity) => {
    persist(items.map((item) => (item._id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id) => {
    persist(items.filter((item) => item._id !== id));
  };

  const clearCart = () => persist([]);

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const nextWishlist = current.some((item) => item._id === product._id)
        ? current.filter((item) => item._id !== product._id)
        : [...current, product];
      localStorage.setItem("blossomWishlist", JSON.stringify(nextWishlist));
      return nextWishlist;
    });
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal > 999 ? 0 : 79;
  const total = subtotal + shipping;

  const value = useMemo(
    () => ({
      items,
      wishlist,
      subtotal,
      shipping,
      total,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist
    }),
    [items, wishlist, subtotal, shipping, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
