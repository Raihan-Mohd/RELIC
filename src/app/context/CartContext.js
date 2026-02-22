"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// database tools needed to talk to the cloud
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CartContext = createContext();

export function CartProvider({ children }) {
  // The display shelf for the cart
  const [cart, setCart] = useState([]);
  
  // Listen to to know exactly who is logged in
  const { user } = useAuth(); 

  // This function runs every time someone logs in or logs out
  useEffect(() => {
    const fetchCloudCart = async () => {
      // If a user is logged in, go get their specific cloud cart
      if (user) {
        try {
          // Request to find this specific user's cart document
          const cartRef = doc(db, "carts", user.uid);
          // Pause and fetch the document from Firebase
          const cartSnap = await getDoc(cartRef);

          // if the document exists in the database, put those items on the shelf
          if (cartSnap.exists()) {
            setCart(cartSnap.data().items);
          } else {
            // ELSE, they are a brand new user, Give them an empty shelf
            setCart([]);
          }
        } catch (error) {
          console.error("Failed to fetch cloud cart:", error);
        }
      } else {
        // IF they log out (!user), immediately empty the shelf so the next person can't see it
        setCart([]);
      }
    };

    fetchCloudCart();
  }, [user]); // Run this exactly when the 'user' changes


  // helper function: Whenever the cart changes, we back it up to Firebase.
  const syncCartToCloud = async (updatedCart) => {
    if (user) {
      try {
        const cartRef = doc(db, "carts", user.uid);
        // Save the exact list of items to their specific cloud document
        await setDoc(cartRef, { items: updatedCart });
      } catch (error) {
        console.error("Failed to sync cart to cloud:", error);
      }
    }
  };

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);      // Update the screen immediately
    syncCartToCloud(newCart); // Send the backup to Firebase silently in the background
  };

  const removeFromCart = (indexToRemove) => {
    const newCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(newCart);      // Update the screen immediately
    syncCartToCloud(newCart); // Send the backup to Firebase
  };

  const clearCart = () => {
    setCart([]);
    syncCartToCloud([]); // Send an empty list to Firebase
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}