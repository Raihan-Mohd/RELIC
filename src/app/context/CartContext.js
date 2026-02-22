"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("relic_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("relic_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // The function to remove an item based on its position in the list
  const removeFromCart = (indexToRemove) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  return (
    // for exporting of the functions
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}