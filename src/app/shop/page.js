"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/app/components/ProductCard";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { findProductsWithText, findProductsWithImage } from "@/app/lib/gemini";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(""); 
  const [isSearchingAI, setIsSearchingAI] = useState(false); 
  const [aiFilteredIds, setAiFilteredIds] = useState(null); 
  const fileInputRef = useRef(null);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceSort, setPriceSort] = useState("Default");

  useEffect(() => {
    const fetchProductsFromDatabase = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const liveData = snapshot.docs.map(doc => doc.data());
        setProducts(liveData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProductsFromDatabase();
  }, []);

  const handleTextSearch = async (e) => {
    e.preventDefault(); 
    if (!searchQuery.trim()) return; 
    setIsSearchingAI(true);
    const matchedIds = await findProductsWithText(searchQuery, products);
    setAiFilteredIds(matchedIds);
    setIsSearchingAI(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSearchingAI(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1]; 
      const mimeType = file.type; 
      const matchedIds = await findProductsWithImage(base64Data, mimeType, products);
      setAiFilteredIds(matchedIds);
      setIsSearchingAI(false);
    };
    reader.readAsDataURL(file);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setAiFilteredIds(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  let processedProducts = products;
  if (aiFilteredIds) processedProducts = processedProducts.filter(product => aiFilteredIds.includes(product.id));
  if (categoryFilter !== "All") processedProducts = processedProducts.filter(product => product.category === categoryFilter);
  if (priceSort === "Low to High") processedProducts = [...processedProducts].sort((a, b) => a.price - b.price);
  else if (priceSort === "High to Low") processedProducts = [...processedProducts].sort((a, b) => b.price - a.price);

  const uniqueCategories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen pb-20">
      
      <div className="relative bg-slate-950 border-b border-slate-800 py-20 px-6 text-center overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full z-[-1]"></div>
        <h1 className="relative font-sans text-4xl md:text-5xl text-white tracking-[0.2em] mb-4 font-black uppercase drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          All Products
        </h1>
        <p className="relative text-slate-400 font-medium uppercase tracking-widest text-sm">
          Browse our complete collection of video game items.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 mb-8">
        <form onSubmit={handleTextSearch} className="bg-slate-900 p-2 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-slate-700 focus-within:border-blue-500 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all flex gap-2 items-center">
          
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          
          <button type="button" onClick={() => fileInputRef.current.click()} disabled={isSearchingAI} title="Search with an Image" className="ml-2 p-3 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-sm transition-colors flex items-center justify-center border border-slate-700 hover:border-blue-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
            </svg>
          </button>
          
          <input 
            type="text" 
            placeholder="Ask the AI (e.g., 'I want a glowing blade')" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="flex-grow bg-transparent px-4 py-4 outline-none text-white placeholder-slate-500 font-medium text-sm font-mono" 
          />
          
          {aiFilteredIds && (
            <button type="button" onClick={clearSearch} className="text-red-500 hover:text-red-400 font-bold px-4 text-sm transition-colors uppercase tracking-wider hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              Clear
            </button>
          )}
          
          <button type="submit" disabled={isSearchingAI} className={`px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-sm text-white transition-all ${isSearchingAI ? 'bg-slate-700 text-slate-400 border border-slate-600' : 'bg-blue-600/20 border border-blue-500 hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]'}`}>
            {isSearchingAI ? "Thinking..." : "Search AI"}
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 border-b border-slate-800 mb-12 uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          Showing {processedProducts.length} Items {aiFilteredIds && "[AI Recommendations Active]"}
        </span>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-slate-300 py-3 px-4 rounded-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase tracking-wider cursor-pointer transition-colors">
            {uniqueCategories.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
          </select>

          <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)} className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-slate-300 py-3 px-4 rounded-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase tracking-wider cursor-pointer transition-colors">
            <option value="Default" disabled hidden className="bg-slate-900">Sort by Price</option>
            <option value="Low to High" className="bg-slate-900">Price: Low to High</option>
            <option value="High to Low" className="bg-slate-900">Price: High to Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-blue-500 font-mono font-bold uppercase tracking-widest animate-pulse flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Loading Products...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
          
          {processedProducts.length === 0 && (
            <div className="col-span-full text-center py-20 border border-dashed border-slate-700 rounded-lg text-slate-500 font-mono text-sm uppercase tracking-widest bg-slate-900/50">
              No matching items found. Try resetting your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}