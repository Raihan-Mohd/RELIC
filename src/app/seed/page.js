"use client";

import { useState } from "react";
import { products as staticProducts } from "@/app/data/products"; 
import { db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function DatabaseSeederPage() {
  const [status, setStatus] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const handleSeedDatabase = async () => {
    if (!window.confirm("WARNING: This will overwrite items in your Firebase database. Proceed?")) return;
    
    setStatus("Uploading to Firebase...");
    setProgress(0);
    
    try {
      for (let i = 0; i < staticProducts.length; i++) {
        const item = staticProducts[i];
        
        const productToSave = {
          id: item.id,
          name: item.name,
          category: item.category || "Uncategorized",
          tags: item.tags || [],
          price: Number(item.price),
          cost: Number(item.cost || 0), 
          lore: item.lore || "",
          image: item.image || "https://via.placeholder.com/400",
          stats: {
            source: item.stats?.source || "Unknown",
            rarity: item.stats?.rarity || "Common",
            cartAdds: 0,
            sales: 0
          }
        };

        await setDoc(doc(db, "products", item.id), productToSave);
        setProgress(Math.round(((i + 1) / staticProducts.length) * 100));
      }
      
      setStatus("Success! Database has been perfectly seeded.");
      
    } catch (error) {
      console.error("Error seeding database:", error);
      setStatus("Error: Failed to seed database. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-sm border border-slate-800 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
        <h1 className="font-sans text-2xl font-black text-white mb-2 uppercase tracking-widest">Database Seeder</h1>
        <p className="text-slate-400 text-sm mb-8 font-mono">
          This script will forcefully write all 30 items from `products.js` to your live Firebase database.
        </p>

        <button 
          onClick={handleSeedDatabase}
          className="w-full bg-blue-600/20 text-blue-400 border border-blue-500 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-md"
        >
          Execute Reset Script
        </button>

        <div className="mt-8 font-mono">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Status: {status}</p>
          <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
            <div 
              className="bg-blue-500 h-4 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{progress}% Complete</p>
        </div>
      </div>
    </div>
  );
}