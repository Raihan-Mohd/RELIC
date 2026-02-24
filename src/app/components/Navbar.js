"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/authContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS 
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",") 
    : [];
  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/" className="font-sans font-black text-2xl tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] flex items-center gap-2">
          <span className="w-3 h-6 bg-blue-600 inline-block animate-pulse rounded-sm"></span>
          RELIC
        </Link>

        <div className="flex items-center space-x-8">
          <Link href="/shop" className="text-sm font-bold text-slate-400 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all uppercase tracking-widest">
            Shop
          </Link>

          <div className="flex items-center space-x-6 border-l border-slate-800 pl-6">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="hidden sm:block text-sm font-bold text-yellow-500/80 hover:text-yellow-400 hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] transition-all uppercase tracking-widest">
                    Admin Dashboard
                  </Link>
                )}

                <Link href="/profile" className="hidden sm:block text-sm font-bold text-slate-400 hover:text-blue-400 transition-all uppercase tracking-widest">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-sm font-bold text-red-500/80 hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all uppercase tracking-widest">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-bold text-blue-500 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all uppercase tracking-widest">
                Login
              </Link>
            )}

            <Link href="/cart" className="relative flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-900 rounded-sm hover:border-blue-500 hover:bg-slate-800 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}