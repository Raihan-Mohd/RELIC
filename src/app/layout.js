import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

//importing of components
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata = {
  title: "RELIC | IRL Inventory",
  description: "Curated artifacts for the discerning wanderer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} antialiased bg-relic-dark text-relic-paper`}>
        
        {/* navbar*/}
        <Navbar />

        {/* This is the main content (page.js) */}
        <main className="min-h-screen pt-20"> 
          {children}
        </main>

        {/* footer*/}
        <Footer />
        
      </body>
    </html>
  );
}