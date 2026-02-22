"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push("/"); 
    } catch (err) {
      console.error("Auth Error:", err);
      setError("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-10 shadow-xl">
        <h1 className="font-serif text-3xl text-slate-900 tracking-wide text-center font-bold mb-2">
          {isLoginMode ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </h1>
        <p className="text-slate-500 text-center text-sm mb-10 font-medium">
          {isLoginMode ? "Enter your details to access your dashboard." : "Register to start collecting digital assets."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Minimum 6 characters"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="mt-6 bg-slate-900 text-white rounded-full py-4 hover:bg-blue-600 transition-all font-bold tracking-widest uppercase shadow-md"
          >
            {isLoginMode ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center pt-6">
          <p className="text-sm font-medium text-slate-500">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mt-2"
          >
            {isLoginMode ? "Create one now" : "Sign in instead"}
          </button>
        </div>
      </div>
      
      <Link href="/" className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
        &larr; Back to Store
      </Link>
    </div>
  );
}