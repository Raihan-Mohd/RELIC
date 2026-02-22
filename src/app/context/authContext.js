"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/app/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

// Create the Context (The Brain/backback)
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Set up the State. It starts as null (Guest)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for changes. Firebase checks if im already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // If logged in, this sets the user data. If logged out, it sets it to null.
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // The Actions (Login, Signup, Logout)
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// shortcut function
export function useAuth() {
  return useContext(AuthContext);
}