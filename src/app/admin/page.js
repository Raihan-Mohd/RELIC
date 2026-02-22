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
    cost: "", 
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
    
    try {
      //  Gets all the current items to check their IDs
      const querySnapshot = await getDocs(collection(db, "products"));
      
      let highestNumber = 0; // Start counting at 0

      // Loop through every single item in the database
      querySnapshot.forEach((doc) => {
        const id = doc.id; // eg. rel-014
        
        // Only look at IDs that start with rel-
        if (id.startsWith("rel-")) {
          // Cut off the rel- part to just get the number string (e.g., "014")
          const numberString = id.substring(4); 
          
          // Convert the string into real math numbers (e.g., 14)
          const currentNumber = parseInt(numberString, 10); 
          
          // IF this number is bigger than our current highest, update it
          if (!isNaN(currentNumber) && currentNumber > highestNumber) {
            highestNumber = currentNumber;
          }
        }
      });

      // Does the math (Add 1 to the highest number found)
      const nextNumber = highestNumber + 1;
      
      // Formats it nicely: .padStart(3, '0') turns "29" into "029"
      const newId = `rel-${nextNumber.toString().padStart(3, '0')}`;

      //Saving to Firebase
      // Package the form data into a neat object
      const productToSave = {
        id: newId, // Using our newly generated smart ID!
        name: newProduct.name,
        price: Number(newProduct.price), 
        cost: Number(newProduct.cost),
        lore: newProduct.description, 
        image: "https://via.placeholder.com/400", 
        stats: {
          source: newProduct.videoGame, 
          rarity: newProduct.rarity
        }
      };

      // Pause and send this new object to the Firebase database
      await setDoc(doc(db, "products", newId), productToSave);
      alert(`Success! Saved to database as ${newId}`);
      
      // Clear out the text boxes so they are empty for the next item
      setNewProduct({ name: "", price: "", cost: "", videoGame: "", rarity: "Common", description: "" });
      
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
      
      <div className="max-w-7xl mx-auto pt-12 border-b border-gray-200 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-sans text-4xl text-slate-900 font-bold tracking-wide mb-2 uppercase">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm">Authenticated as: <span className="text-blue-600">{user.email}</span></p>
        </div>
        
        <div className="flex space-x-6 text-sm font-bold tracking-widest uppercase">
          <button 
            onClick={() => setActiveTab("analytics")} 
            className={`pb-2 border-b-2 transition-colors ${activeTab === "analytics" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-900"}`}
          >
            Reports
          </button>
          <button 
            onClick={() => setActiveTab("product")} 
            className={`pb-2 border-b-2 transition-colors ${activeTab === "product" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-900"}`}
          >
            Inventory Management
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        
        {activeTab === "analytics" && (
           <div className="text-center py-20 text-slate-400 font-sans font-bold uppercase tracking-widest">
             Gathering Real Data...
           </div>
        )}

        {/* INVENTORY MANAGEMENT */}
        {activeTab === "product" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-fit">
              <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                <input type="number" placeholder="Selling Price ($)" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                
                {/*The Input Box for Cost */}
                <input type="number" placeholder="Cost to Acquire ($)" required value={newProduct.cost} onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                
                <input type="text" placeholder="Video Game" required value={newProduct.videoGame} onChange={(e) => setNewProduct({...newProduct, videoGame: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                <select value={newProduct.rarity} onChange={(e) => setNewProduct({...newProduct, rarity: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option>Common</option><option>Rare</option><option>Legendary</option>
                </select>
                <textarea placeholder="Product Description" required rows="3" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"></textarea>
                <button type="submit" className="mt-2 bg-slate-900 text-white rounded-xl py-3 hover:bg-blue-600 transition-all font-bold tracking-widest uppercase text-sm">Save to Database</button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest">Live Inventory</h3>
                <span className="text-slate-500 text-xs font-bold">{products.length} Items</span>
              </div>
              {isLoadingProducts ? (
                <div className="text-center py-10 text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Loading database...</div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {products.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border border-gray-100 p-4 rounded-xl hover:border-blue-200 transition-colors bg-slate-50">
                      <div>
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">Price: ${item.price} • Cost: ${item.cost || 0}</p>
                      </div>
                      <button onClick={() => handleDeleteProduct(item.id)} className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg border border-red-200 transition-colors uppercase tracking-widest">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}