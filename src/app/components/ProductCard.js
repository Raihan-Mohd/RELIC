"use client";

import Image from "next/image";
import Link from "next/link"; 
import { useCart } from "@/app/context/CartContext";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCartClick = async () => {
    addToCart(product);
    alert(`Added to cart: ${product.name}`);
    try {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { "stats.cartAdds": increment(1) });
    } catch (error) {
      console.error("Failed to track popularity:", error);
    }
  };

  return (
    // Dark gradient, floating animation on hover, and neon glow effect
    <div className="group relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:-translate-y-2 hover:border-blue-500/50 transition-all duration-500 ease-out flex flex-col h-full overflow-hidden">
      
      {/* A cool cyberpunk detail at the top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>

      {/* Darker backdrop, smoother scale */}
      <Link href={`/shop/${product.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-950 border-b border-slate-800 block cursor-pointer">
        {/* Rarity Tag: Now looks like a gaming loot badge */}
        <span className="absolute top-3 right-3 px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-slate-900/80 text-blue-400 border border-blue-500/30 rounded-sm shadow-sm z-10 backdrop-blur-md">
          {product.stats.rarity}
        </span>
        
        {/* Overlay to make it feel a bit darker until hovered */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-0"></div>
        
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow relative z-10">
        
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-sans text-lg text-white font-bold mb-1 group-hover:text-blue-400 transition-colors cursor-pointer drop-shadow-md">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[10px] text-slate-400 mb-3 font-bold tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {product.category}
        </p>
        
        <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow leading-relaxed">
          {product.lore} 
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800">
          {/* Price: Neon Green/Gold vibe */}
          <span className="text-blue-400 font-bold text-xl drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
            R{product.price}
          </span>
          
          {/*Cyberpunk UI style */}
          <button 
            onClick={handleAddToCartClick}
            className="text-xs font-bold text-white bg-blue-600/20 border border-blue-500/50 px-4 py-2 rounded-sm hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-300 uppercase tracking-widest"
          >
            Add to Cart
          </button>
        </div>
      </div>
      
    </div>
  );
}