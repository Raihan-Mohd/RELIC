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
      {/* Changed the background to white/slate and removed the dark mode colors */}
      <body className={`${inter.variable} ${cinzel.variable} antialiased bg-slate-50 text-slate-900`}>
        
        <CartProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-20"> 
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </CartProvider>
        
      </body>
    </html>
  );
}