"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { db } from "@/app/lib/firebase";
import { collection, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // display shelves for both Products and Orders
  const [activeTab, setActiveTab] = useState("analytics"); 
  const [products, setProducts] = useState([]); 
  const [orders, setOrders] = useState([]); //  State for the receipts
  const [isLoading, setIsLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "", price: "", cost: "", videoGame: "", rarity: "Common", description: ""
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
        router.push("/login");
      } else if (!adminEmails.includes(user.email)) {
        router.push("/"); 
      }
    }
  }, [user, loading, router]);

  //Database Operations
  // operation 1: READ
  //fetching all data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      //  Fetch the Products
      const prodSnap = await getDocs(collection(db, "products"));
      setProducts(prodSnap.docs.map(doc => doc.data()));

      // Fetch the Orders (Receipts)
      const orderSnap = await getDocs(collection(db, "orders"));
      setOrders(orderSnap.docs.map(doc => doc.data()));
      
    } catch (error) {
      console.error("Error fetching database:", error);
    }
    setIsLoading(false);
  };

  // Run the fetch as soon as the admin dashboard loads
  useEffect(() => {
    fetchAllData();
  }, []);

  // Operation 2: CREATE
  // Triggered when the Admin clicks Save to Database
  //  Add Product Logic
  const handleAddProduct = async (e) => {
    e.preventDefault(); // stop the page from refreshing
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      let highestNumber = 0; 
      querySnapshot.forEach((doc) => {
        const id = doc.id; 
        if (id.startsWith("rel-")) {
          const numberString = id.substring(4); 
          const currentNumber = parseInt(numberString, 10); 
          if (!isNaN(currentNumber) && currentNumber > highestNumber) {
            highestNumber = currentNumber;
          }
        }
      });

      const nextNumber = highestNumber + 1;
      const newId = `rel-R{nextNumber.toString().padStart(3, '0')}`;
      
      const productToSave = {
        id: newId, 
        name: newProduct.name,
        price: Number(newProduct.price), 
        cost: Number(newProduct.cost), 
        lore: newProduct.description, 
        image: "https://via.placeholder.com/400", 
        stats: {
          source: newProduct.videoGame, 
          rarity: newProduct.rarity,
          cartAdds: 0, 
          sales: 0
        }
      };

      await setDoc(doc(db, "products", newId), productToSave);
      alert(`Success! Saved to database as R{newId}`);
      setNewProduct({ name: "", price: "", cost: "", videoGame: "", rarity: "Common", description: "" });
      fetchAllData(); 
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        fetchAllData(); 
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  
  // FINANCIAL REPORT
  // Loop through every receipt and add up the revenue and the cost.
  const totalRevenue = orders.reduce((sum, order) => sum + (order.revenue || 0), 0);
  const totalCost = orders.reduce((sum, order) => sum + (order.cost || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  // PRODUCT REPORT
  // Sort the products to find the one with the highest cartAdds stat
  const sortedProducts = [...products].sort((a, b) => (b.stats?.cartAdds || 0) - (a.stats?.cartAdds || 0));
  const topProduct = sortedProducts.length > 0 ? sortedProducts[0] : null;
  
  // Format data for the Recharts graph (Top 5 most added to cart)
  const chartData = sortedProducts.slice(0, 5).map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    AddedToCart: item.stats?.cartAdds || 0
  }));

  // CUSTOMER REPORT
  // creates a temporary scoreboard to track how much each email has spent
  const customerScoreboard = {};
  orders.forEach(order => {
    if (!customerScoreboard[order.buyerEmail]) {
      customerScoreboard[order.buyerEmail] = 0;
    }
    customerScoreboard[order.buyerEmail] += order.revenue;
  });
  
  // Find the email with the highest score
  const topCustomerArray = Object.entries(customerScoreboard).sort((a, b) => b[1] - a[1]);
  const bestCustomerEmail = topCustomerArray.length > 0 ? topCustomerArray[0][0] : "No buyers yet";
  const bestCustomerSpent = topCustomerArray.length > 0 ? topCustomerArray[0][1] : 0;


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
          <button onClick={() => setActiveTab("analytics")} className={`pb-2 border-b-2 transition-colors R{activeTab === "analytics" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-900"}`}>
            Reports
          </button>
          <button onClick={() => setActiveTab("product")} className={`pb-2 border-b-2 transition-colors R{activeTab === "product" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-900"}`}>
            Inventory Management
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-sans font-bold uppercase tracking-widest animate-pulse">Loading Live Data...</div>
        ) : (
          <>
            {/* THE REPORTS TAB*/}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                
                {/* FINANCIAL REPORT */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-gray-200 pb-2 uppercase tracking-wide">1. Financial Report</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Total Sales Revenue</h3>
                      <p className="font-sans font-bold text-4xl text-slate-900">R{totalRevenue}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Cost of Goods Sold</h3>
                      <p className="font-sans font-bold text-4xl text-slate-900">R{totalCost}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl border border-green-100 shadow-sm p-8 text-center">
                      <h3 className="text-green-600 font-bold text-xs uppercase tracking-widest mb-4">Net Profit</h3>
                      <p className="font-sans font-bold text-4xl text-green-700">R{totalProfit}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* PRODUCT REPORT */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-gray-100 pb-2 uppercase tracking-wide">2. Product Report</h2>
                    <div className="mb-8">
                      <p className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-1">Most Popular Product:</p>
                      <p className="text-2xl font-bold text-blue-600">{topProduct ? topProduct.name : "N/A"}</p>
                      <p className="text-sm text-slate-500 mt-1">Category (Video Game): {topProduct ? topProduct.stats.source : "N/A"}</p>
                      <p className="text-sm font-bold text-slate-900 mt-2">Added to Carts: {topProduct ? topProduct.stats.cartAdds : 0} times</p>
                    </div>

                    <div className="h-[250px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="AddedToCart" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Times Added to Cart" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* CUSTOMER REPORT */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-gray-100 pb-2 uppercase tracking-wide">3. Customer Report</h2>
                    <div className="bg-slate-50 border border-gray-100 rounded-xl p-6">
                      <p className="text-sm text-slate-500 uppercase font-bold tracking-widest mb-1">Top Spending Customer:</p>
                      <p className="text-xl font-bold text-slate-900 break-all">{bestCustomerEmail}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm">
                          Total Spent: R{bestCustomerSpent}
                        </div>
                        <div className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm">
                          Orders Placed: {orders.filter(o => o.buyerEmail === bestCustomerEmail).length}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* INVENTORY MANAGEMENT */}
            {activeTab === "product" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-fit">
                  <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Add New Product</h3>
                  <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                    <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    <input type="number" placeholder="Selling Price (R)" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    <input type="number" placeholder="Cost to Acquire (R)" required value={newProduct.cost} onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})} className="bg-slate-50 border border-gray-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
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
                  <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {products.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border border-gray-100 p-4 rounded-xl hover:border-blue-200 transition-colors bg-slate-50">
                        <div>
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">Price: R{item.price} • Cost: R{item.cost || 0}</p>
                        </div>
                        <button onClick={() => handleDeleteProduct(item.id)} className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg border border-red-200 transition-colors uppercase tracking-widest">Delete</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}