"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/authContext"; 
import { db } from "@/app/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export default function ProductDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };
    fetchSingleProduct();
  }, [id]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (user && product) {
        const wishlistRef = doc(db, "wishlists", user.uid);
        const snap = await getDoc(wishlistRef);
        if (snap.exists()) {
          const items = snap.data().items || [];
          if (items.some(item => item.id === product.id)) setInWishlist(true);
        }
      }
    };
    checkWishlist();
  }, [user, product]);

  const handleAddToCart = async () => {
    addToCart(product);
    alert(`Added to cart: ${product.name}`);
    try {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, { "stats.cartAdds": increment(1) });
    } catch (error) {
      console.error("Failed to track popularity:", error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please log in to save items to your wishlist.");
      router.push("/login");
      return;
    }
    try {
      const wishlistRef = doc(db, "wishlists", user.uid);
      const snap = await getDoc(wishlistRef);
      let currentItems = snap.exists() ? snap.data().items || [] : [];

      if (inWishlist) {
        currentItems = currentItems.filter(i => i.id !== product.id);
        setInWishlist(false);
      } else {
        currentItems.push(product);
        setInWishlist(true);
      }
      await setDoc(wishlistRef, { items: currentItems });
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-mono font-bold uppercase tracking-widest animate-pulse">Loading Product...</div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center"><h1 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-widest font-mono">Product Not Found</h1><button onClick={() => router.push("/shop")} className="text-slate-400 hover:text-white uppercase tracking-widest font-bold">Return to Shop</button></div>;

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/shop" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all uppercase tracking-widest mb-10 font-mono">
          ← Back to Shop
        </Link>

        <div className="bg-slate-900 rounded-sm border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row relative group">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 z-20"></div>

          <div className="md:w-1/2 relative min-h-[400px] md:min-h-[600px] bg-slate-950 border-r border-slate-800">
            <span className="absolute top-6 left-6 px-4 py-2 text-[10px] uppercase font-bold tracking-widest bg-slate-900/80 text-blue-400 border border-blue-500/30 rounded-sm shadow-sm z-10 backdrop-blur-md">
              {product.stats.rarity}
            </span>
            <Image src={product.image} alt={product.name} fill className="object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50 z-0"></div>
          </div>

          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-10">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {product.category} // {product.stats.source}
            </p>
            <h1 className="font-sans text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-md">
              {product.name}
            </h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed font-mono">
              {product.lore}
            </p>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {product.tags.map(tag => <span key={tag} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-sm uppercase tracking-widest font-bold">{tag}</span>)}
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-slate-800">
              <p className="text-3xl font-bold text-blue-400 mb-8 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                R{product.price}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleAddToCart} className="flex-1 bg-blue-600/20 text-white border border-blue-500 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all">
                  Add to Cart
                </button>
                
                <button 
                  onClick={toggleWishlist}
                  className={`px-8 py-4 border rounded-sm font-bold uppercase tracking-widest transition-all ${inWishlist ? 'bg-red-900/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-transparent border-slate-600 text-slate-400 hover:border-red-500 hover:text-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                >
                  {inWishlist ? '♥ Saved' : '♡ Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}