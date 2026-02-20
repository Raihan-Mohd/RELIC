"use client"; // reading the dynamic cart data and therefore is required

import {useCart} from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
    //Grab the cart array from the context
    const { cart } = useCart();

    // Grab the current user identity
    const { user } = useAuth();
    const router = useRouter();

    // Calculate the total price (loops through the cart and adds item.price to a running/continuous sum of them)
    const total = cart.reduce((sum, item) => sum + item.price, 0);

      // The Gatekeeper Function
    const handleCheckout = () => {
      if (!user) {
        // If the user is null (Guest), redirect them to the login page
        alert("Authentication required. Redirecting to the Guild Registry...");
        router.push("/login");
      } else {
        // If they are logged in (Customer), run the simulation required by the brief
        alert(`Simulation Complete! Order confirmed for ${user.email}. Total: R${total}`);
        // In a real app, we would clear the cart and save the order to the database here.
      }
    };

return (
    <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Heading */}
      <h1 className="font-serif text-4xl text-relic-gold mb-8 tracking-widest border-b border-relic-charcoal pb-4">
        YOUR CART
      </h1>

      {/* If cart is empty, show this */}
      {cart.length === 0 ? (
        <div className="text-center py-20 border border-relic-charcoal bg-relic-dark/50">
          <p className="text-relic-paper opacity-70 mb-6 font-serif italic">
            Your bag is empty, traveler.
          </p>
          <Link href="/shop" className="border border-relic-gold text-relic-gold px-6 py-2 hover:bg-relic-gold hover:text-relic-dark transition-colors uppercase tracking-widest text-sm">
            Return to Shop
          </Link>
        </div>
      ) : (
        /* ...Else, if there are items, show the list */
        <div className="space-y-6">
          
          {/*Uses .map() to generate a row for every item */}
          {cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-relic-dark border border-relic-charcoal p-4 hover:border-relic-gold/50 transition-colors">
              <div className="flex items-center gap-6">
                
                {/* Item Image */}
                <div className="relative w-16 h-16 bg-black border border-relic-charcoal">
                  <Image src={item.image} alt={item.name} fill className="object-cover opacity-80" />
                </div>
                
                {/* Item Details */}
                <div>
                  <h3 className="font-serif text-relic-bone text-lg">{item.name}</h3>
                  <p className="text-xs text-relic-paper opacity-60">from {item.stats.source}</p>
                </div>
                
              </div>
              
              {/* Item Price */}
              <div className="text-relic-gold font-bold">
                R {item.price}
              </div>
            </div>
          ))}

          {/* The Checkout Section */}
          <div className="border-t border-relic-gold pt-6 mt-8 flex flex-col items-end">
            <div className="flex justify-between w-full md:w-1/2 text-xl mb-6">
              <span className="font-serif text-relic-paper uppercase tracking-widest">Total Amount:</span>
              <span className="font-bold text-relic-gold">R {total}</span>
            </div>
            
            <button onClick={handleCheckout} className="bg-relic-gold text-relic-dark px-8 py-3 font-bold tracking-widest hover:bg-relic-bone transition-colors w-full md:w-auto">
              PROCEED TO CHECKOUT
            </button>
            {/* Dynamic helper text based on login status */}
            {!user && (
              <p className="text-xs text-relic-red opacity-80 mt-3 text-right">
                * Authentication required to complete trade.
              </p>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}