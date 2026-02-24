"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to complete your checkout.");
      router.push("/login");
      return;
    }
    if (cartItems.length === 0) return;

    try {
      let totalRevenue = 0;
      let totalCost = 0;

      const purchasedItems = cartItems.map(item => {
        totalRevenue += Number(item.price);
        totalCost += Number(item.cost || 0);
        return {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          cost: Number(item.cost || 0)
        };
      });

      const orderData = {
        buyerEmail: user.email,
        date: new Date().toISOString(),
        purchasedItems: purchasedItems,
        revenue: totalRevenue,
        cost: totalCost,
        status: "Pending"
      };

      await addDoc(collection(db, "orders"), orderData);
      
      alert("Checkout successful! Order placed.");
      clearCart(); 
      router.push("/profile"); 
      
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Error during checkout.");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 mb-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <span className="text-4xl">🛒</span>
        </div>
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Cart is Empty</h1>
        <p className="text-slate-400 font-mono text-sm mb-8 uppercase tracking-widest">You haven't added any items yet.</p>
        <Link href="/shop" className="bg-blue-600/20 text-blue-400 border border-blue-500 hover:bg-blue-600 hover:text-white transition-all px-8 py-4 rounded-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          Back to Shop
        </Link>
      </div>
    );
  }

  const totalRevenue = (cartItems || []).reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="font-sans text-4xl text-white font-black tracking-widest mb-12 uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] border-b border-slate-800 pb-6">
          Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-2/3 space-y-6">
            {(cartItems || []).map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-6 bg-slate-900 border border-slate-800 p-4 rounded-sm shadow-md group hover:border-blue-500/50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600/50 group-hover:bg-blue-500 transition-colors"></div>
                
                <div className="relative w-24 h-24 bg-slate-950 border border-slate-800 rounded-sm overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
                
                <div className="flex-grow flex flex-col justify-center">
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors drop-shadow-sm">{item.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">ID: {item.id}</p>
                </div>

                <div className="flex flex-col items-end justify-center min-w-[100px] border-l border-slate-800 pl-6">
                  <p className="font-bold text-blue-400 text-xl drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] mb-2">R{item.price}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors font-mono hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
                    [ Remove ]
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-slate-900 rounded-sm border border-slate-700 p-8 sticky top-32 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
              
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest drop-shadow-sm">Summary</h2>
              
              <div className="space-y-4 mb-8 font-mono text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="text-white">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-white">R0.00</span>
                </div>
                <div className="h-px bg-slate-800 my-4"></div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-sans font-bold text-white uppercase tracking-widest">Total:</span>
                  <span className="font-bold text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] text-2xl">R{totalRevenue}</span>
                </div>
              </div>

              {!user ? (
                <div className="text-center">
                  <p className="text-xs text-red-400 font-mono mb-4 uppercase tracking-widest">Authentication Required</p>
                  <Link href="/login" className="block w-full text-center bg-slate-800 text-white py-4 rounded-sm font-bold uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-colors">
                    Login to Continue
                  </Link>
                </div>
              ) : (
                <button onClick={handleCheckout} className="w-full bg-blue-600/20 border border-blue-500 text-white py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all">
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}