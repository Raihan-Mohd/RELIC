"use client";

// I import our global Contexts so this page can hear what is happening elsewhere
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  
  // get the cart items and the removeFromCart action
  const { cart, removeFromCart } = useCart();
  
  // this is to listen to the Auth to see who is currently logged in
  const { user } = useAuth();
  const router = useRouter();

  // A simple math calculation to get the total price of all items in the cart
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  //When checkout button clicked
  const handleCheckoutClick = () => {
    // Is the user a Guest? (!user means "not a user")
    if (!user) {
      alert("Authentication required. Redirecting to Login...");
      router.push("/login"); // Send them to the login page
    } else {
      // They are logged in, Run the required simulation.
      alert(`Simulation Complete! Order confirmed for ${user.email}. Total: $${total}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-sans text-4xl text-slate-900 mb-8 tracking-widest font-bold border-b border-gray-200 pb-6 uppercase">
          Your Cart
        </h1>

        {/* Display logic*/}
        {/* IF the cart is empty (length is exactly 0), show this empty state screen */}
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
          
          // ELSE (the cart has items), show the list
          <div className="space-y-4">
            
            {/* Loop through the cart array and draw a box for each item */}
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-slate-900 font-bold text-lg">{item.name}</h3>
                    
                    {/* Video Game */}
                    <p className="text-sm text-slate-500 font-medium mb-1">
                      Video Game: {item.stats.source}
                    </p>
                    
                    {/*  Clicking this triggers the removeFromCart action from our Context */}
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

            {/* Checkout Section */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 mt-8 shadow-sm flex flex-col items-end">
              <div className="flex justify-between w-full md:w-1/2 text-xl mb-8 border-b border-gray-100 pb-4">
                <span className="font-medium text-slate-500">Subtotal:</span>
                <span className="font-bold text-slate-900">${total}</span>
              </div>
              
              {/* Trigger the Checkout Logic */}
              <button 
                onClick={handleCheckoutClick}
                className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold tracking-widest hover:bg-blue-600 transition-colors w-full md:w-auto shadow-lg uppercase"
              >
                Proceed to Checkout
              </button>
              
              {/* Only show this warning IF they are NOT logged in */}
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