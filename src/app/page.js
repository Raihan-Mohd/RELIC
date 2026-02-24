import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      
      {/* hero section */}
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Background Glowing Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-600/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-blue-500 font-mono text-sm font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-blue-500/50"></span>
            Premium Gaming Artifacts
            <span className="w-8 h-px bg-blue-500/50"></span>
          </span>
          
          <h1 className="font-sans text-5xl md:text-7xl font-black text-white uppercase tracking-widest mb-8 leading-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Equip Your <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 drop-shadow-none">Real World</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl leading-relaxed">
            Curated, high-fidelity replicas, decor, and apparel from your favorite digital realms. Secure your loot today.
          </p>

          <Link href="/shop" className="group relative px-8 py-5 bg-blue-600/10 border border-blue-500 text-white font-bold uppercase tracking-widest rounded-sm hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 w-0 bg-blue-600 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
            <span className="relative z-10 flex items-center gap-3">
              Enter The Shop
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* quick categories */}
      <div className="relative z-10 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-950 border border-slate-800 p-10 rounded-sm hover:border-blue-500/50 transition-colors group">
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 group-hover:text-blue-400 transition-colors">Legendary Decor</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-mono">Enhance your base with high-quality statues, replicas, and artifacts.</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-10 rounded-sm hover:border-blue-500/50 transition-colors group">
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 group-hover:text-blue-400 transition-colors">Atmospheric Lighting</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-mono">Neon signs and LED lamps to set the perfect mood for your gaming setup.</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-10 rounded-sm hover:border-blue-500/50 transition-colors group">
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4 group-hover:text-blue-400 transition-colors">Tactical Gear</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-mono">Apparel and accessories to show your allegiance in the real world.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}