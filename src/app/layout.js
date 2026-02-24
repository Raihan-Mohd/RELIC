import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

import { CartProvider } from "@/app/context/CartContext";
import { AuthProvider } from "@/app/context/authContext";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });

export const metadata = {
  title: "RELIC | Modern Digital Assets",
  description: "Premium items for every universe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Dark background, smooth scrolling, and light text by default */}
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        <AuthProvider>
        <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-20"> 
              {children}
            </main>
            <Footer />
        </CartProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}