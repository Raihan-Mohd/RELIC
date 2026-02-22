"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/authContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link href="/" className="font-serif text-2xl text-slate-900 tracking-widest hover:text-slate-600 transition-colors font-bold">
          RELIC
        </Link>

        <div className="hidden md:flex space-x-8 text-slate-600 font-sans text-sm tracking-wide font-medium">
          <Link href="/" className="hover:text-black transition-colors">HOME</Link>
          <Link href="/shop" className="hover:text-black transition-colors">CATALOG</Link>
          <Link href="/about" className="hover:text-black transition-colors">ABOUT</Link>
          
          {user && (user.email === "ammarcanani@gmail.com" || user.email === "elsje.scott@uct.ac.za" || user.email === "test@relic.com") && (
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 transition-colors font-bold">
              ADMIN
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/cart" className="text-slate-600 hover:text-black transition-colors flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider">CART</span>
            <span className="bg-slate-900 text-white px-2 py-0.5 text-xs font-bold rounded-full">
              {cart.length}
            </span>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 hidden sm:block font-medium">{user.email}</span>
              <button onClick={logout} className="text-sm font-medium text-slate-600 border border-slate-300 rounded-full px-5 py-1.5 hover:bg-slate-100 transition-all">
                LOGOUT
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-white bg-slate-900 rounded-full px-6 py-1.5 hover:bg-slate-800 transition-all">
              LOGIN
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}