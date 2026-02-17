import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-relic-charcoal bg-relic-dark py-12 mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Column 1: Brand & Mission */}
        <div className="text-center md:text-left">
          <h2 className="font-serif text-relic-gold text-lg tracking-widest mb-4">
            RELIC
          </h2>
          <p className="text-relic-paper opacity-70">
            Premium gaming collectibles and prop replicas. 
            Curated for quality and authenticity.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-2 text-center text-relic-paper opacity-80">
          <Link href="/shop" className="hover:text-relic-gold transition-colors">All Products</Link>
          <Link href="/about" className="hover:text-relic-gold transition-colors">About Us</Link>
          <Link href="/faq" className="hover:text-relic-gold transition-colors">FAQ</Link>
        </div>

        {/* Column 3: Legal & Support */}
        <div className="flex flex-col space-y-2 text-center md:text-right text-relic-paper opacity-80">
          <Link href="/terms" className="hover:text-relic-gold transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-relic-gold transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-relic-gold transition-colors">Contact Support</Link>
        </div>

      </div>

      <div className="mt-12 text-center text-xs text-relic-charcoal border-t border-relic-charcoal pt-8">
        &copy; 2026 RELIC. All rights reserved.
      </div>
    </footer>
  );
}