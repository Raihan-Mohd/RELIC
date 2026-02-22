"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";
import Image from "next/image";

import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const productsCollection = collection(db, "products");
        const snapshot = await getDocs(productsCollection);
        const liveData = snapshot.docs.map(doc => doc.data());
        setFeaturedProducts(liveData.slice(0, 4));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* RELIC hero section */}
      <section className="relative w-full min-h-[85vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d6e0eb] to-[#e8edf2] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="z-10">
            <h1 className="font-serif text-5xl md:text-7xl text-slate-800 leading-tight mb-6 tracking-wide">
              PRODUCTS FOR NOW <br/> AND FOREVER WITH <br/> <span className="text-blue-700 font-bold">RELIC</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-md mb-10 font-medium">
              Embark on a journey where ancient digital assets and cutting-edge curation fuse seamlessly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors text-sm font-bold tracking-wider shadow-lg">
                Explore Collection ↗
              </Link>
              <Link href="/about" className="border border-slate-400 text-slate-700 px-8 py-3 rounded-full hover:bg-white transition-colors text-sm font-bold tracking-wider">
                About Us —
              </Link>
            </div>
          </div>

          <div className="relative h-[60vh] w-full hidden md:block rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-300 to-slate-200 flex flex-col items-center justify-center">
                <div className="w-32 h-32 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-slate-600 font-sans font-bold tracking-widest uppercase">Awaiting Visuals...</span>
             </div>
          </div>

        </div>
      </section>

      {/* new collection section*/}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
          <h2 className="font-sans font-bold text-sm tracking-widest text-slate-400 uppercase">
            Curated Discoveries
          </h2>
          <Link href="/shop" className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors flex items-center gap-2">
            See all <span className="text-lg">→</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-sans font-bold uppercase tracking-widest animate-pulse">
            Syncing database...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}