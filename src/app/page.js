"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";

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
        
        // Slice the array to only keep the first 4 items for the homepage
        setFeaturedProducts(liveData.slice(0, 4));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch from the Vault:", error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      
      <section className="text-center py-32 px-6 border-b border-relic-charcoal bg-gradient-to-b from-relic-dark to-black">
        <h1 className="font-serif text-6xl md:text-8xl text-relic-gold mb-6 tracking-widest drop-shadow-lg">
          RELIC
        </h1>
        <p className="text-relic-paper text-xl max-w-2xl mx-auto italic font-serif opacity-80 mb-10">
          "Welcome to the inventory of the lost. Browse our curated artifacts from worlds beyond."
        </p>
        <Link href="/shop" className="border border-relic-gold text-relic-gold px-8 py-3 hover:bg-relic-gold hover:text-relic-dark transition-colors uppercase tracking-widest text-sm font-bold">
          Enter The Vault
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex justify-between items-end mb-8 border-b border-relic-charcoal pb-4">
          <h2 className="font-serif text-2xl text-relic-bone tracking-widest">
            FEATURED ARTIFACTS
          </h2>
          <Link href="/shop" className="text-sm text-relic-gold hover:text-relic-bone transition-colors uppercase tracking-widest">
            View All &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-relic-gold font-serif animate-pulse">
            Summoning artifacts...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}