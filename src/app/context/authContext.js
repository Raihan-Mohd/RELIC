"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "@/app/lib/firebase";
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Google login
  const loginWithGoogle = async () => {
    try {
      // This single line opens the secure Google popup window
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Login cancelled by user.");
      } else {
        console.error("Google Sign-In Error:", error);
      }
    }
  };

  // Standard Email Signup
  const registerWithEmail = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // Standard Email Login
  const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // exposes the new login functions to the rest of the app
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      registerWithEmail, 
      loginWithEmail, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);