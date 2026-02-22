"use client";

import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

// Importing of database tools to track popularity
import { db } from "@/app/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function ProductCard({ product }) {
  //  Grab the cart  function
  const { addToCart } = useCart();

  // added async here so it can talk to the database when clicked
  const handleAddToCartClick = async () => {
    
    // Instantly update the user's screen so they don't have to wait for the database
    addToCart(product);
    alert(`Added to cart: ${product.name}`);

    // Send a silent, background ping to Firebase to increase this item's popularity!
    try {
      // Find this specific product in the database
      const productRef = doc(db, "products", product.id);
      
      // Tell Firebase: Update the cartAdds stat by adding exactly 1 to it
      await updateDoc(productRef, {
        "stats.cartAdds": increment(1)
      });
      
    } catch (error) {
      console.error("Failed to track popularity:", error);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Product Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 border-b border-gray-100">
        <span className="absolute top-3 right-3 px-3 py-1 text-[10px] uppercase font-bold tracking-wider bg-white/90 text-slate-800 rounded-full shadow-sm z-10 backdrop-blur-sm">
          {product.stats.rarity}
        </span>
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-lg text-slate-900 font-bold mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs text-slate-500 mb-3 font-medium tracking-wide uppercase">
          Video Game: {product.stats.source}
        </p>
        
        <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-grow leading-relaxed">
          {product.lore} 
        </p>

        {/* Price and Button Section */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span className="text-slate-900 font-bold text-lg">
            R{product.price}
          </span>
          
          <button 
            onClick={handleAddToCartClick}
            className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-full hover:bg-blue-600 transition-colors uppercase tracking-wider"
          >
            Add to Cart
          </button>
        </div>
      </div>
      
    </div>
  );
}