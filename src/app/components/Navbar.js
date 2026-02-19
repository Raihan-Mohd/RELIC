"use client";
import Link from "next/link";

import { useCart } from "@/app/context/CartContext";

export default function Navbar() {

   //pulls addToCart function from useCart in CartContext.js
  const { cart } = useCart();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-relic-gold bg-relic-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left (Relic Brand Name) */}
        <Link href="/" className="font-serif text-2xl text-relic-gold tracking-widest hover:text-relic-bone transition-colors">
          RELIC
        </Link>

        {/* center (Standard Navigation )*/}
        <div className="hidden md:flex space-x-8 text-relic-paper font-sans text-sm tracking-wide">
          <Link href="/" className="hover:text-relic-gold transition-colors">
            HOME
          </Link>
          <Link href="/shop" className="hover:text-relic-gold transition-colors">
            SHOP
          </Link>
          <Link href="/about" className="hover:text-relic-gold transition-colors">
            ABOUT
          </Link>
        </div>

        {/* right (Cart & Account) */}
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="text-relic-paper hover:text-relic-gold transition-colors flex items-center gap-2">
            <span className="text-xs font-bold">CART</span>
            <span className="bg-relic-gold text-relic-dark px-1.5 py-0.5 text-xs font-bold rounded-sm">
              {cart.length}
            </span>
          </Link>
          
          <Link href="/login" className="text-sm text-relic-gold border border-relic-gold px-4 py-1 hover:bg-relic-gold hover:text-relic-dark transition-all">
            LOGIN
          </Link>
        </div>

      </div>
    </nav>
  );
}