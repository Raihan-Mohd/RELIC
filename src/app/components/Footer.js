import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <Link href="/" className="font-sans font-black text-2xl tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] flex items-center gap-2 mb-6">
              <span className="w-3 h-6 bg-blue-600 inline-block rounded-sm"></span>
              RELIC
            </Link>
            <p className="text-slate-400 text-sm font-mono max-w-xs">
              Equipping gamers with premium, high-fidelity artifacts for the real world.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Navigation</h4>
            <ul className="space-y-4 text-sm font-mono text-slate-400">
              <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Shop</Link></li>
              <li><Link href="/cart" className="hover:text-blue-400 transition-colors">Cart</Link></li>
              <li><Link href="/profile" className="hover:text-blue-400 transition-colors">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Support</h4>
            <ul className="space-y-4 text-sm font-mono text-slate-400">
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs font-mono">
            &copy; {new Date().getFullYear()} RELIC. All rights reserved. Not affiliated with actual game studios.
          </p>
        </div>
      </div>
    </footer>
  );
}