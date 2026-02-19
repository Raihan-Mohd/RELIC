import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// Importing of the Global Cart Wrapper from CartContext.js
import { CartProvider } from "@/app/context/CartContext";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });

export const metadata = {
  title: "RELIC | IRL Inventory",
  description: "Curated artifacts for the discerning wanderer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} antialiased bg-relic-dark text-relic-paper`}>
        
        {/* Wrapping of the application so all components can access the cart data (cartContext.js) */}
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-20"> 
            {children}
          </main>
          <Footer />
        </CartProvider>
        
      </body>
    </html>
  );
}