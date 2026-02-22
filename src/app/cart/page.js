"use client";

// I import our global Contexts so this page can hear what is happening elsewhere
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Importing the database tools so we can save Receipts
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CartPage() {
  
  //get the cart items and removeFromCart actions
  // added clearCart so we can empty it after they buy
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Basic math: Add up the price of everything in the cart (Revenue)
  const totalRevenue = cart.reduce((sum, item) => sum + item.price, 0);
  
  // Add up the cost of everything in the cart (For our Profit calculation)
  // uses `item.cost || 0` just in case an older product doesn't have a cost saved yet
  const totalCost = cart.reduce((sum, item) => sum + (item.cost || 0), 0);

  const handleCheckoutClick = async () => {
    // Kick them out if they aren't logged in
    if (!user) {
      alert("Authentication required. Redirecting to Login...");
      router.push("/login");
      return; // Stop the code right here
    }

    try {
      // Write the Digital Receipt
      const receipt = {
        buyerEmail: user.email,
        date: new Date().toISOString(), // Saves the exact date and time
        revenue: totalRevenue,
        cost: totalCost,
        // makes a simple list of just the IDs and Names of the items they bought
        purchasedItems: cart.map(item => ({ id: item.id, name: item.name })) 
      };

      // Pause and send this receipt to a new orders folder in Firebase
      await addDoc(collection(db, "orders"), receipt);

      //  Successful and Empty the cart completely 
      clearCart();
      
      //Tell the user it worked
      alert(`Checkout Complete! Order confirmed for ${user.email}.`);

    } catch (error) {
      console.error("Checkout failed:", error);
      alert("There was an error processing your transaction.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-sans text-4xl text-slate-900 mb-8 tracking-widest font-bold border-b border-gray-200 pb-6 uppercase">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-slate-500 mb-8 font-medium text-lg">
              Your cart is currently empty.
            </p>
            <Link href="/shop" className="bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors uppercase tracking-widest text-sm font-bold shadow-md">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-slate-900 font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-1">
                      Video Game: {item.stats.source}
                    </p>
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-slate-900 font-bold text-xl">
                  ${item.price}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-3xl border border-gray-100 p-8 mt-8 shadow-sm flex flex-col items-end">
              <div className="flex justify-between w-full md:w-1/2 text-xl mb-8 border-b border-gray-100 pb-4">
                <span className="font-medium text-slate-500">Subtotal:</span>
                <span className="font-bold text-slate-900">${totalRevenue}</span>
              </div>
              
              {/* Clicking the button triggers Checkout logic */}
              <button 
                onClick={handleCheckoutClick}
                className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold tracking-widest hover:bg-blue-600 transition-colors w-full md:w-auto shadow-lg uppercase"
              >
                Proceed to Checkout
              </button>
              
              {!user && (
                <p className="text-sm text-red-500 font-medium mt-4 text-right">
                  * Authentication required to complete purchase.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}