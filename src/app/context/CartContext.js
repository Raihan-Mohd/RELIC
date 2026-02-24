"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  
  // A safety lock to prevent the cart from overwriting itself when the page first loads
  const [isInitialized, setIsInitialized] = useState(false);

  // loads the cart(When the app opens or user logs in)
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // If logged in, grab their saved cart from Firebase
        try {
          const cartRef = doc(db, "carts", user.uid);
          const snap = await getDoc(cartRef);
          if (snap.exists()) {
            setCartItems(snap.data().items || []);
          } else {
            // If they are a new user, check if they added stuff as a guest first, and keep it
            const localCart = JSON.parse(localStorage.getItem("relic_cart")) || [];
            setCartItems(localCart);
          }
        } catch (error) {
          console.error("Error loading cloud cart:", error);
        }
      } else {
        // If they are a guest, just load from the browser's local storage
        const localCart = JSON.parse(localStorage.getItem("relic_cart")) || [];
        setCartItems(localCart);
      }
      setIsInitialized(true); // Unlock the save function
    };
    
    loadCart();
  }, [user]);

  // Save the cart (Anytime items are added or removed)
  useEffect(() => {
    // If the app just opened, don't accidentally save an empty array over their real cart
    if (!isInitialized) return; 

    // Always save a backup to the browser's local storage
    localStorage.setItem("relic_cart", JSON.stringify(cartItems));

    // If they are logged in, sync it to Firebase instantly
    const saveToCloud = async () => {
      if (user) {
        try {
          await setDoc(doc(db, "carts", user.uid), { items: cartItems });
        } catch (error) {
          console.error("Error saving cloud cart:", error);
        }
      }
    };
    saveToCloud();
  }, [cartItems, user, isInitialized]);

  // cart actions
  const addToCart = (product) => {
    // adds the new product to the end of the existing list
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    // filters out the item they want to remove. 
    // (Note: To remove just one instance of an item if they have duplicates, we find the first index).
    setCartItems((prev) => {
      const index = prev.findIndex(item => item.id === productId);
      if (index === -1) return prev;
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);