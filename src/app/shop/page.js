"use client";

// useState creates our Display Shelves, and useEffect triggers actions when the store opens
import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";

// This is the map to the Firebase Database
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ShopPage() {

  // products is the shelf. It starts empty ([]). 
  // setProducts is the action of putting boxes on the shelf.
  const [products, setProducts] = useState([]);
  
  // We use this state to show a loading screen while the request is on its way
  const [isLoading, setIsLoading] = useState(true);

  // useEffect says do this the moment the page loads
  useEffect(() => {
    
    // We create an async function because traveling across the internet takes time
    const fetchProductsFromDatabase = async () => {
      try {
        // 1. says where to go and look (the products collection in Firebase)
        const productsCollection = collection(db, "products");
        
        // await: The code pauses here. It waits for the request to head to Firebase, get the data, and head back
        const snapshot = await getDocs(productsCollection);
        
        // Unpack the data from the request into a neat, clean list
        // .map loops through each item
        const liveData = snapshot.docs.map(doc => doc.data());
        
        //  Put the unpacked data onto the Display Shelves
        // Next.js sees this and instantly redraws the screen to show the items unlike normal js that is more manual
        setProducts(liveData);
        
        // The data arrived back, so we stop showing the loading screen
        setIsLoading(false);
        //error handling
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    // Start the fetching products process (calls it)
    fetchProductsFromDatabase();
    
  }, []); // The empty [] means only run this once when the store opens

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* White Header */}
      <div className="bg-white border-b border-gray-200 py-16 px-6 text-center">
        <h1 className="font-sans text-4xl text-slate-900 tracking-widest mb-4 font-bold uppercase">
          All Products
        </h1>
        <p className="text-slate-500 font-medium">
          Browse our complete collection of video game items.
        </p>
      </div>

      {/* Modern Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-sm font-bold text-slate-500 border-b border-gray-200 mb-8">
        <span>Showing {products.length} items</span>
        <div className="flex gap-6 uppercase tracking-wider">
          <span className="cursor-pointer text-slate-900 border-b-2 border-slate-900 pb-1">All</span>
          <span className="cursor-pointer hover:text-blue-600 transition-colors pb-1">Legendary</span>
          <span className="cursor-pointer hover:text-blue-600 transition-colors pb-1">Rare</span>
        </div>
      </div>

      {/* If the request is still being sent (isLoading is true), show a loading message */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 font-sans font-bold uppercase tracking-widest animate-pulse">
          Loading products...
        </div>
      ) : (
        // Once the data has been brought back, map through the products and draw a ProductCard for each one
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}