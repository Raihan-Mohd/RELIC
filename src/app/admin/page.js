"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from "@/app/lib/firebase";
import { collection, getDocs, setDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("analytics"); 
  const [products, setProducts] = useState([]); 
  const [orders, setOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Added image to the initial state
  const [newProduct, setNewProduct] = useState({
    name: "", price: "", cost: "", videoGame: "", rarity: "Common", description: "", tags: "", image: ""
  });

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",") : [];

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (!adminEmails.includes(user.email)) router.push("/"); 
    }
  }, [user, loading, router]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const prodSnap = await getDocs(collection(db, "products"));
      setProducts(prodSnap.docs.map(doc => doc.data()));

      const orderSnap = await getDocs(collection(db, "orders"));
      setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching database:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleSaveProduct = async (e) => {
    e.preventDefault(); 
    try {
      const tagsArray = newProduct.tags ? newProduct.tags.split(',').map(tag => tag.trim().toLowerCase()) : [];
      const productData = {
        name: newProduct.name, 
        price: Number(newProduct.price), 
        cost: Number(newProduct.cost), 
        lore: newProduct.description, 
        // Uses the uploaded image, or falls back to a placeholder
        image: newProduct.image || "https://via.placeholder.com/400", 
        tags: tagsArray,
        stats: { source: newProduct.videoGame, rarity: newProduct.rarity, cartAdds: editingId ? undefined : 0, sales: editingId ? undefined : 0 }
      };

      if (editingId) {
        productData.id = editingId;
        await updateDoc(doc(db, "products", editingId), productData);
      } else {
        let highestNumber = 0; 
        products.forEach((p) => {
          if (p.id && p.id.startsWith("rel-")) {
            const currentNumber = parseInt(p.id.substring(4), 10); 
            if (!isNaN(currentNumber) && currentNumber > highestNumber) highestNumber = currentNumber;
          }
        });
        const newId = `rel-${(highestNumber + 1).toString().padStart(3, '0')}`;
        productData.id = newId;
        await setDoc(doc(db, "products", newId), productData);
      }
      
      // Reset form
      setNewProduct({ name: "", price: "", cost: "", videoGame: "", rarity: "Common", description: "", tags: "", image: "" });
      setEditingId(null);
      fetchAllData(); 
    } catch (error) { console.error("Error saving product:", error); }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name, price: product.price, cost: product.cost || "",
      videoGame: product.stats?.source || "", rarity: product.stats?.rarity || "Common",
      description: product.lore || "", tags: product.tags ? product.tags.join(", ") : "",
      image: product.image || "" // Load existing image into form
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        if (editingId === id) {
          setEditingId(null);
          setNewProduct({ name: "", price: "", cost: "", videoGame: "", rarity: "Common", description: "", tags: "", image: "" });
        }
        fetchAllData(); 
      } catch (error) { console.error("Error deleting product:", error); }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      fetchAllData(); 
    } catch (error) { console.error("Failed to update status", error); }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.revenue || 0), 0);
  const totalCost = orders.reduce((sum, order) => sum + (order.cost || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  const sortedProducts = [...products].sort((a, b) => (b.stats?.cartAdds || 0) - (a.stats?.cartAdds || 0));
  const topProduct = sortedProducts.length > 0 ? sortedProducts[0] : null;
  const chartData = sortedProducts.slice(0, 5).map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    AddedToCart: item.stats?.cartAdds || 0
  }));

  const customerScoreboard = {};
  orders.forEach(order => {
    if (!customerScoreboard[order.buyerEmail]) customerScoreboard[order.buyerEmail] = 0;
    customerScoreboard[order.buyerEmail] += order.revenue;
  });
  const topCustomerArray = Object.entries(customerScoreboard).sort((a, b) => b[1] - a[1]);
  const bestCustomerEmail = topCustomerArray.length > 0 ? topCustomerArray[0][0] : "N/A";
  const bestCustomerSpent = topCustomerArray.length > 0 ? topCustomerArray[0][1] : 0;

  if (loading || !user || !adminEmails.includes(user.email)) return <div className="min-h-screen flex items-center justify-center text-yellow-500 font-mono font-bold uppercase tracking-widest bg-slate-950">Verifying Admin Access...</div>;

  return (
    <div className="min-h-screen bg-slate-950 pb-20 px-6 pt-10">
      
      <div className="max-w-7xl mx-auto pt-12 border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-yellow-600/10 blur-[60px] rounded-full z-[-1]"></div>
        <div>
          <h1 className="font-sans text-4xl text-white font-black tracking-wide mb-2 uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">Admin Dashboard</h1>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Admin: <span className="text-yellow-500">{user.email}</span></p>
        </div>
        
        <div className="flex space-x-6 text-xs font-bold tracking-widest uppercase font-mono">
          <button onClick={() => setActiveTab("analytics")} className={`pb-2 border-b-2 transition-all ${activeTab === "analytics" ? "border-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" : "border-transparent text-slate-500 hover:text-slate-300"}`}>Reports</button>
          <button onClick={() => setActiveTab("product")} className={`pb-2 border-b-2 transition-all ${activeTab === "product" ? "border-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" : "border-transparent text-slate-500 hover:text-slate-300"}`}>Inventory</button>
          <button onClick={() => setActiveTab("orders")} className={`pb-2 border-b-2 transition-all ${activeTab === "orders" ? "border-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" : "border-transparent text-slate-500 hover:text-slate-300"}`}>Orders</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20 text-yellow-500 font-mono font-bold uppercase tracking-widest animate-pulse">Loading Live Data...</div>
        ) : (
          <>
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2 uppercase tracking-wide font-mono">1. Financial Report</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 rounded-sm border border-slate-800 shadow-md p-8 text-center">
                      <h3 className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-4">Gross Revenue</h3>
                      <p className="font-sans font-black text-4xl text-white drop-shadow-md">R{totalRevenue}</p>
                    </div>
                    <div className="bg-slate-900 rounded-sm border border-slate-800 shadow-md p-8 text-center">
                      <h3 className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-4">Cost of Goods Sold</h3>
                      <p className="font-sans font-black text-4xl text-white drop-shadow-md">R{totalCost}</p>
                    </div>
                    <div className="bg-green-950/30 rounded-sm border border-green-900/50 shadow-md p-8 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
                      <h3 className="text-green-500 font-mono text-xs uppercase tracking-widest mb-4">Net Profit</h3>
                      <p className="font-sans font-black text-4xl text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">R{totalProfit}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 rounded-sm border border-slate-800 shadow-md p-8">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-2 uppercase tracking-wide font-mono">2. Product Report</h2>
                    <div className="mb-8 font-mono">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Most Popular Product:</p>
                      <p className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{topProduct ? topProduct.name : "N/A"}</p>
                      <p className="text-xs text-slate-500 mt-1">Category: {topProduct ? topProduct.stats.source : "N/A"}</p>
                      <p className="text-xs font-bold text-white mt-2">Added to Carts: {topProduct ? topProduct.stats.cartAdds : 0}</p>
                    </div>
                    <div className="h-[250px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                          <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                          <Tooltip cursor={{fill: '#0f172a'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px'}} />
                          <Bar dataKey="AddedToCart" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Times Added" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-sm border border-slate-800 shadow-md p-8">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-2 uppercase tracking-wide font-mono">3. Customer Report</h2>
                    <div className="bg-slate-950 border border-slate-800 rounded-sm p-6 relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-yellow-500/50"></div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1 font-mono">Top Spending Customer:</p>
                      <p className="text-xl font-bold text-white break-all">{bestCustomerEmail}</p>
                      <div className="mt-4 flex items-center gap-4 font-mono">
                        <div className="bg-blue-900/30 border border-blue-800/50 text-blue-400 px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                          Total Spent: R{bestCustomerSpent}
                        </div>
                        <div className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest">
                          Orders Placed: {orders.filter(o => o.buyerEmail === bestCustomerEmail).length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "product" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-slate-900 rounded-sm border border-slate-800 shadow-md p-8 h-fit">
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 font-mono">
                    {editingId ? `Edit Product: ${editingId}` : "Add New Product"}
                  </h3>
                  
                  <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 font-mono">
                    <input type="text" placeholder="Product Name" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-3 rounded-sm focus:outline-none focus:border-blue-500 text-xs" />
                    <input type="number" placeholder="Value (R)" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-3 rounded-sm focus:outline-none focus:border-blue-500 text-xs" />
                    <input type="number" placeholder="Cost (R)" required value={newProduct.cost} onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})} className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-3 rounded-sm focus:outline-none focus:border-blue-500 text-xs" />
                    <input type="text" placeholder="Video Game" required value={newProduct.videoGame} onChange={(e) => setNewProduct({...newProduct, videoGame: e.target.value})} className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-3 rounded-sm focus:outline-none focus:border-blue-500 text-xs" />
                    <input type="text" placeholder="Tags (e.g., sword, neon)" value={newProduct.tags} onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})} className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-3 rounded-sm focus:outline-none focus:border-blue-500 text-xs" />
                    
                    <select value={newProduct.rarity} onChange={(e) => setNewProduct({...newProduct, rarity: e.target.value})} className="bg-slate-950 border border-slate-800 text-white p-3 rounded-sm focus:outline-none focus:border-blue-500 text-xs cursor-pointer">
                      <option className="bg-slate-900">Common</option><option className="bg-slate-900">Uncommon</option><option className="bg-slate-900">Rare</option><option className="bg-slate-900">Epic</option><option className="bg-slate-900">Legendary</option>
                    </select>
                    <textarea placeholder="Product Description" required rows="3" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="bg-slate-950 border border-slate-800 text-white placeholder-slate-600 p-3 rounded-sm focus:outline-none focus:border-blue-500 text-xs resize-none"></textarea>
                    
                    {/* Image Upload Section */}
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-sm">
                      <label className="text-xs text-slate-500 block mb-2 uppercase tracking-widest font-bold">Upload Image (PNG/JPG):</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            // Convert image to Base64 string so it can be saved in the database
                            reader.onloadend = () => setNewProduct({...newProduct, image: reader.result});
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="text-[10px] text-white file:bg-slate-800 file:border-0 file:text-blue-400 file:px-3 file:py-1 file:rounded-sm hover:file:bg-slate-700 cursor-pointer w-full"
                      />
                      {newProduct.image && (
                        <div className="mt-3">
                          <img src={newProduct.image} alt="Preview" className="h-20 w-20 object-cover rounded-sm border border-slate-700" />
                        </div>
                      )}
                    </div>

                    <button type="submit" className={`mt-2 text-white py-3 rounded-sm transition-all font-bold tracking-widest uppercase text-xs ${editingId ? 'bg-yellow-600/20 border border-yellow-500 hover:bg-yellow-600 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-blue-600/20 border border-blue-500 hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`}>
                      {editingId ? "Update Product" : "Save to Database"}
                    </button>

                    {editingId && (
                      <button type="button" onClick={() => { setEditingId(null); setNewProduct({ name: "", price: "", cost: "", videoGame: "", rarity: "Common", description: "", tags: "", image: "" }); }} className="bg-transparent border border-slate-600 text-slate-400 py-3 rounded-sm hover:border-slate-400 hover:text-white transition-all font-bold tracking-widest uppercase text-xs">
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>

                <div className="lg:col-span-2 bg-slate-900 rounded-sm border border-slate-800 shadow-md p-8">
                  <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest font-mono">Live Inventory</h3>
                    <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest font-mono">{products.length} Items</span>
                  </div>
                  <div className="max-h-[700px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {products.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border border-slate-800 p-4 rounded-sm hover:border-blue-500/50 transition-colors bg-slate-950 group relative">
                        <div className="absolute left-0 top-0 w-1 h-full bg-slate-800 group-hover:bg-blue-500 transition-colors"></div>
                        <div className="pl-2 flex gap-4 items-center">
                          {/* Display the image thumbnail in the inventory list */}
                          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-sm overflow-hidden flex-shrink-0 relative">
                            <img src={item.image} alt={item.name} className="object-cover w-full h-full opacity-80" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white font-sans">{item.name} <span className="text-[9px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-sm text-slate-400 ml-2 font-mono uppercase tracking-widest">{item.id}</span></h4>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Price: R{item.price} // Cost: R{item.cost || 0}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 font-mono">
                          <button onClick={() => handleEditClick(item)} className="text-[10px] font-bold text-yellow-500 hover:text-white border border-yellow-500/50 hover:bg-yellow-600 px-4 py-1.5 rounded-sm transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(234,179,8,0)] hover:shadow-[0_0_10px_rgba(234,179,8,0.5)]">Edit</button>
                          <button onClick={() => handleDeleteProduct(item.id)} className="text-[10px] font-bold text-red-500 hover:text-white border border-red-500/50 hover:bg-red-600 px-4 py-1.5 rounded-sm transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0)] hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-slate-900 rounded-sm border border-slate-800 shadow-md p-8">
                <div className="flex justify-between items-end mb-6 border-b border-slate-800 pb-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest font-mono">Order Management</h3>
                  <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest font-mono">{orders.length} Receipts</span>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-slate-500 text-center py-10 font-mono text-[10px] uppercase tracking-widest">No orders have been placed yet.</p>
                  ) : (
                    orders.sort((a, b) => new Date(b.date) - new Date(a.date)).map((order) => (
                      <div key={order.id} className="border border-slate-800 rounded-sm p-6 bg-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-blue-500/30 transition-colors relative overflow-hidden">
                        
                        <div className="absolute left-0 top-0 w-1 h-full bg-slate-800 group-hover:bg-blue-500/50 transition-colors"></div>

                        <div className="pl-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">
                            {new Date(order.date).toLocaleDateString()} // {new Date(order.date).toLocaleTimeString()}
                          </p>
                          <p className="font-bold text-white text-lg mb-2 drop-shadow-sm">{order.buyerEmail}</p>
                          <div className="flex flex-wrap gap-2">
                            {order.purchasedItems?.map((item, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-sm font-mono uppercase tracking-widest">
                                {item.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 pl-4">
                          <p className="font-black text-2xl text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">R{order.revenue}</p>
                          
                          <select 
                            value={order.status || "Pending"} 
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm border outline-none cursor-pointer transition-colors font-mono
                              ${(!order.status || order.status === "Pending") ? "bg-yellow-900/20 text-yellow-500 border-yellow-500/50" : ""}
                              ${order.status === "Processing" ? "bg-blue-900/20 text-blue-400 border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.4)]" : ""}
                              ${order.status === "Shipped" ? "bg-green-900/20 text-green-400 border-green-500/50 shadow-[0_0_8px_rgba(74,222,128,0.4)]" : ""}
                              ${order.status === "Cancelled" ? "bg-red-900/20 text-red-500 border-red-500/50" : ""}
                            `}
                          >
                            <option value="Pending" className="bg-slate-900">Pending</option>
                            <option value="Processing" className="bg-slate-900">Processing</option>
                            <option value="Shipped" className="bg-slate-900">Shipped</option>
                            <option value="Cancelled" className="bg-slate-900">Cancelled</option>
                          </select>
                        </div>
                        
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}