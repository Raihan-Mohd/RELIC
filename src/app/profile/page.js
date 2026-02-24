"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("wishlist");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const wishlistRef = doc(db, "wishlists", user.uid);
        const wishlistSnap = await getDoc(wishlistRef);
        if (wishlistSnap.exists()) setWishlistItems(wishlistSnap.data().items || []);

        const ordersQuery = query(collection(db, "orders"), where("buyerEmail", "==", user.email));
        const orderSnap = await getDocs(ordersQuery);
        setOrderHistory(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
      setIsFetching(false);
    };
    fetchUserData();
  }, [user]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-mono font-bold uppercase tracking-widest animate-pulse">Loading Profile...</div>;

  return (
    <div className="min-h-screen pb-20 px-6 pt-10">
      
      <div className="max-w-7xl mx-auto pt-12 border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full z-[-1]"></div>
        <div>
          <h1 className="font-sans text-4xl text-white font-black tracking-wide mb-2 uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">My Profile</h1>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Email: <span className="text-blue-500">{user.email}</span></p>
        </div>
        
        <div className="flex space-x-6 text-xs font-bold tracking-widest uppercase font-mono">
          <button onClick={() => setActiveTab("wishlist")} className={`pb-2 border-b-2 transition-all ${activeTab === "wishlist" ? "border-blue-500 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
            Wishlist ({wishlistItems.length})
          </button>
          <button onClick={() => setActiveTab("orders")} className={`pb-2 border-b-2 transition-all ${activeTab === "orders" ? "border-blue-500 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
            Order History ({orderHistory.length})
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {isFetching ? (
          <div className="text-center py-20 text-blue-500 font-mono font-bold uppercase tracking-widest animate-pulse">Loading Your Data...</div>
        ) : (
          <>
            {activeTab === "wishlist" && (
              <div>
                {wishlistItems.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-sm p-16 text-center shadow-lg font-mono">
                    <p className="text-slate-500 uppercase tracking-widest text-xs mb-6">Your wishlist is currently empty.</p>
                    <button onClick={() => router.push("/shop")} className="bg-blue-600/20 text-blue-400 border border-blue-500 px-8 py-3 rounded-sm hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-xs font-bold hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]">Explore Catalog</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlistItems.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-slate-900 rounded-sm border border-slate-800 p-8 shadow-lg">
                {orderHistory.length === 0 ? (
                  <p className="text-slate-500 text-center py-10 font-mono uppercase tracking-widest text-xs">You haven't placed any orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orderHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((order) => (
                      <div key={order.id} className="border border-slate-700 rounded-sm p-6 bg-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/50 group-hover:bg-blue-500 transition-colors"></div>
                        
                        <div className="pl-4">
                          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Ordered on: {new Date(order.date).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.purchasedItems?.map((item, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-sm uppercase tracking-widest font-bold font-mono">
                                {item.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 pl-4">
                          <p className="font-bold text-2xl text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">R{order.revenue}</p>
                          
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm font-mono border
                            ${(!order.status || order.status === "Pending") ? "bg-yellow-900/20 text-yellow-500 border-yellow-500/50" : ""}
                            ${order.status === "Processing" ? "bg-blue-900/20 text-blue-400 border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.4)]" : ""}
                            ${order.status === "Shipped" ? "bg-green-900/20 text-green-400 border-green-500/50 shadow-[0_0_8px_rgba(74,222,128,0.4)]" : ""}
                            ${order.status === "Cancelled" ? "bg-red-900/20 text-red-500 border-red-500/50" : ""}
                          `}>
                            {order.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}