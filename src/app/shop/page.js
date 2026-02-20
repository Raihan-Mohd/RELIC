"use client"; // Required because we use State and fetch data

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";

// Importing of the Firebase connection and database tools
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ShopPage() {
  // products starts as an empty array until the data arrives.
  //set up our state
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // A loading screen toggle

  //Fetch the data as soon as the page loads
  useEffect(() => {
    // We create an async function because fetching takes time
    const fetchArtifacts = async () => {
      try {
        // Tell Firebase we want to look inside the products collection
        const productsCollection = collection(db, "products");
        
        // Pause and wait for the database to send the documents back
        const snapshot = await getDocs(productsCollection);
        
        // Loop through the documents and format them into a neat array
        const liveData = snapshot.docs.map(doc => doc.data());
        
        // Update the State. Next.js will automatically redraw the screen.
        setProducts(liveData);
        setIsLoading(false); // Turn off the loading screen
      } catch (error) {
        console.error("Failed to fetch from the Vault:", error);
      }
    };

    fetchArtifacts(); // Run the function
  }, []); // The empty [] means that this will run this only once when the page opens

  return (
    <div className="min-h-screen pb-20">
      <div className="text-center py-12 px-6 border-b border-relic-charcoal bg-relic-dark">
        <h1 className="font-serif text-4xl text-relic-gold tracking-widest mb-4">
          FULL INVENTORY
        </h1>
        <p className="text-relic-paper opacity-80 font-serif italic">
          Browse all recovered artifacts.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-sm text-relic-paper border-b border-relic-charcoal mb-8">
        <span>Showing all {products.length} items</span>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:text-relic-gold">[ All ]</span>
          <span className="cursor-pointer hover:text-relic-gold">[ Legendary ]</span>
          <span className="cursor-pointer hover:text-relic-gold">[ Rare ]</span>
        </div>
      </div>

      {/* Show a loading message while waiting for the internet */}
      {isLoading ? (
        <div className="text-center py-20 text-relic-gold font-serif animate-pulse">
          Opening the Vault...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
      
    </div>
  );
}