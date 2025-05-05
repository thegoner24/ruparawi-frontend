"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCart } from "../cart/api";

interface CartContextType {
  count: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({ count: 0, refreshCart: async () => {} });

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);

  const refreshCart = async () => {
    try {
      const data = await fetchCart();
      const total = (data.cart_items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      setCount(total);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ count, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
