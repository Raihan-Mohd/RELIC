"use client"; // Required for forms and state

import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation"; // Next.js tool for changing pages
import Link from "next/link";

export default function LoginPage() {
  // State for our form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // A toggle to switch between Login mode and Signup mode
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Bring in the tools from our Auth Brain/backpack
  const { login, signup } = useAuth();
  const router = useRouter(); // using this to redirect the user after success

  // Async function to handle the internet request
  const handleSubmit = async (e) => {
    //  Stop the browser from refreshing the page
    e.preventDefault();
    setError(""); // Clear any old errors

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      // If we get here without an error, it worked. Send them to the Home page.
      router.push("/"); 
      
    } catch (err) {
      // If Firebase says Wrong password or Email in use, catch it and show it
      console.error("Auth Error:", err);
      setError("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-relic-dark">
      
      {/* The Login Card */}
      <div className="w-full max-w-md border border-relic-charcoal bg-black/50 p-8 shadow-2xl">
        
        <h1 className="font-serif text-3xl text-relic-gold tracking-widest text-center mb-2">
          {isLoginMode ? "AUTHENTICATE" : "JOIN THE GUILD"}
        </h1>
        <p className="text-relic-paper opacity-60 text-center text-sm mb-8 font-serif italic">
          {isLoginMode ? "Enter your credentials to access your inventory." : "Register your spirit to begin trading."}
        </p>

        {/* The Form Element */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-relic-paper uppercase tracking-widest">Scribe (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              // Update state every time a key is pressed
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-transparent border border-relic-charcoal text-relic-bone p-3 focus:outline-none focus:border-relic-gold transition-colors"
              placeholder="wanderer@landsbetween.com"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-relic-paper uppercase tracking-widest">Cipher (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-transparent border border-relic-charcoal text-relic-bone p-3 focus:outline-none focus:border-relic-gold transition-colors"
              placeholder="Minimum 6 characters"
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="text-relic-red text-xs border border-relic-red/50 bg-relic-red/10 p-3 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            className="mt-4 border border-relic-gold bg-relic-gold/10 text-relic-gold px-8 py-3 hover:bg-relic-gold hover:text-relic-dark transition-all uppercase tracking-widest font-bold"
          >
            {isLoginMode ? "Enter Vault" : "Forge Account"}
          </button>
        </form>

        {/* Toggle Mode Button */}
        <div className="mt-8 text-center border-t border-relic-charcoal pt-6">
          <p className="text-sm text-relic-paper opacity-70">
            {isLoginMode ? "A new wanderer?" : "Already possess a cipher?"}
          </p>
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-relic-gold hover:text-relic-bone transition-colors mt-2 underline underline-offset-4"
          >
            {isLoginMode ? "Register here" : "Authenticate here"}
          </button>
        </div>

      </div>
      
      <Link href="/" className="mt-8 text-xs text-relic-charcoal hover:text-relic-paper transition-colors uppercase tracking-widest">
        &larr; Return to Wilderness
      </Link>
    </div>
  );
}