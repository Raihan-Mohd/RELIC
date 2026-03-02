"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const router = useRouter();
  
  // State for the email/password form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/shop");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    await loginWithGoogle();
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error) {
      alert("Authentication Failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glowing Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full bg-slate-900 rounded-sm border border-slate-800 p-10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-center group hover:border-blue-500/30 transition-colors">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 z-20"></div>

        <Link href="/" className="font-sans font-black text-2xl tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 mb-8">
          <span className="w-3 h-6 bg-blue-600 inline-block animate-pulse rounded-sm"></span>
          RELIC
        </Link>
        
        <h1 className="font-sans text-2xl text-white font-black tracking-widest uppercase mb-2 drop-shadow-sm">
          Network Login
        </h1>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-8">
          Secure access to your cart, wishlist, and orders.
        </p>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="bg-slate-950 border border-slate-800 text-white p-3 rounded-sm outline-none focus:border-blue-500 text-sm font-mono" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="bg-slate-950 border border-slate-800 text-white p-3 rounded-sm outline-none focus:border-blue-500 text-sm font-mono" 
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600/20 text-blue-400 border border-blue-500 hover:bg-blue-600 hover:text-white transition-all py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            {isRegistering ? "Create Account" : "Access Network"}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <button 
          onClick={() => setIsRegistering(!isRegistering)} 
          className="text-xs text-slate-500 font-mono hover:text-blue-400 mb-6 transition-colors"
        >
          {isRegistering ? "Already have an account? Log in." : "Need an account? Register."}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-xs text-slate-500 font-mono">OR</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-4 bg-slate-950 border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500 transition-all py-4 rounded-sm font-bold uppercase tracking-widest shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-[10px] text-slate-500 mt-8 font-mono leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy. New accounts will be created automatically.
        </p>

      </div>
    </div>
  );
}