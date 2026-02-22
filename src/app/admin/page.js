"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// The tools to talk to our Firebase Database
import { db } from "@/app/lib/firebase";
import { collection, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

//managing what can be seen
  const [activeTab, setActiveTab] = useState("financial"); // Remembers which tab we clicked
  const [products, setProducts] = useState([]); // The display shelf for our database items
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // This state holds the temporary information we type into the Add Product form
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    videoGame: "", 
    rarity: "Common",
    description: ""
  });

  // Pull the secure string from the env and split it into an array
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS 
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",") 
    : [];

  //Security
  // If the page is done loading, we check IF the user is allowed here.
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login"); // Kick out guests
      } else if (!adminEmails.includes(user.email)) {
        router.push("/"); // Kick out normal customers
      }
    }
  }, [user, loading, router]);

  //Database Operations
  // operation 1: READ
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      //  Pause and go get all the items from the products collection
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = querySnapshot.docs.map(doc => doc.data());
      setProducts(items); // Put them on the state shelf
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoadingProducts(false);
  };

  // Fetch products automatically when the user clicks the Product tab
  useEffect(() => {
    if (activeTab === "product") {
      fetchProducts();
    }
  }, [activeTab]);

  // Operation 2: CREATE
  // Triggered when the Admin clicks Save to Database
  const handleAddProduct = async (e) => {
    e.preventDefault(); // Stop the page from refreshing
    
    // Create a unique ID based on the current time
    const newId = `product-${Date.now()}`;
    
    // Package the form data into a neat object
    const productToSave = {
      id: newId,
      name: newProduct.name,
      price: Number(newProduct.price), // Convert text to a real number
      lore: newProduct.description, // Keeping lore so it matches existing database
      image: "https://via.placeholder.com/400", 
      stats: {
        source: newProduct.videoGame, // Keeping source for the database
        rarity: newProduct.rarity
      }
    };

    try {
      // Pause and send this new object to the Firebase database
      await setDoc(doc(db, "products", newId), productToSave);
      alert("Product successfully added to the database!");
      
      // Clear out the text boxes so they are empty for the next item
      setNewProduct({ name: "", price: "", videoGame: "", rarity: "Common", description: "" });
      
      // Fetch the updated list from the database to show the new item
      fetchProducts(); 
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  // Operation 3: DELETE
  // Triggered when the Admin clicks the red Delete button
  const handleDeleteProduct = async (id) => {
    // Only proceed IF they click OK on the warning box
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        // Pause and tell Firebase to delete the specific document ID
        await deleteDoc(doc(db, "products", id));
        fetchProducts(); // Refresh the display shelf so the deleted item vanishes
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };


  // If still checking security, show a loading screen
  if (loading || !user || !adminEmails.includes(user.email)) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-sans font-bold uppercase tracking-widest">Verifying Admin Access...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 px-6 pt-10">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto pt-12 border-b border-gray-200 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-sans text-4xl text-slate-900 font-bold tracking-wide mb-2 uppercase">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm">Authenticated as: <span className="text-blue-600">{user.email}</span></p>
        </div>
        
        {/* PILLAR 2 (Events) & PILLAR 4 (State): Clicking these buttons changes the 'activeTab' state */}
        <div className="flex space-x-6 text-sm font-bold tracking-widest uppercase">
          <button 
            onClick={() => setActiveTab("financial")} 
            className={`pb-2 border-b-2 transition-colors ${activeTab === "financial" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-900"}`}
          >
            Financial
          </button>
          <button 
            onClick={() => setActiveTab("product")} 
            className={`pb-2 border-b-2 transition-colors ${activeTab === "product" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-900"}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab("customer")} 
            className={`pb-2 border-b-2 transition-colors ${activeTab === "customer" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-900"}`}
          >
            Customers
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* FINANCIAL (Simulated) */}
        {activeTab === "financial" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Total Sales Revenue</h3>
              <p className="font-sans font-bold text-4xl text-slate-900">$ 42,500</p>
            </div>
            
          </div>
        )}

        {/* PRODUCTS (Live Database) */}
        {activeTab === "product" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Create Product Form */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-fit">
              <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Add New Product</h3>
              
              {/* PILLAR 2 (Events): When the form submits, it runs handleAddProduct */}
              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                
                {/* PILLAR 4 (State): These inputs update the newProduct memory in real-time as you type */}
                <input 
                  type="text" placeholder="Product Name" required
                  value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input 
                  type="number" placeholder="Price ($)" required
                  value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input 
                  type="text" placeholder="Video Game (e.g. Cyberpunk 2077)" required
                  value={newProduct.videoGame} onChange={(e) => setNewProduct({...newProduct, videoGame: e.target.value})}
                  className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <select 
                  value={newProduct.rarity} onChange={(e) => setNewProduct({...newProduct, rarity: e.target.value})}
                  className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option>Common</option>
                  <option>Rare</option>
                  <option>Legendary</option>
                </select>
                <textarea 
                  placeholder="Product Description" required rows="3"
                  value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                ></textarea>
                
                <button type="submit" className="mt-2 bg-slate-900 text-white rounded-xl py-3 hover:bg-blue-600 transition-all font-bold tracking-widest uppercase text-sm">
                  Save to Database
                </button>
              </form>
            </div>

            {/* Right Column: Live Inventory List */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest">Live Inventory</h3>
                <span className="text-slate-500 text-xs font-bold">{products.length} Items</span>
              </div>

              {isLoadingProducts ? (
                <div className="text-center py-10 text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">
                  Loading database...
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {/* Map through the items and display them */}
                  {products.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border border-gray-100 p-4 rounded-xl hover:border-blue-200 transition-colors bg-slate-50">
                      <div>
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.stats.source} • ${item.price}</p>
                      </div>
                      
                      {/* The Delete Button */}
                      <button 
                        onClick={() => handleDeleteProduct(item.id)}
                        className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg border border-red-200 transition-colors uppercase tracking-widest"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* CUSTOMERS (Simulated) */}
        {activeTab === "customer" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Top Customers</h3>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}