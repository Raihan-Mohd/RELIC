export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-12 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] border-b border-slate-800 pb-6">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none text-slate-400 font-mono text-sm leading-relaxed">
          <p className="mb-6">Last Updated: 2026</p>
          <p className="mb-6">By accessing the Relic storefront, you agree to be bound by these terms. This application is a demonstration and educational portfolio piece.</p>
          
          <h2 className="text-white font-bold uppercase tracking-widest mt-8 mb-4">1. Store Operations</h2>
          <p className="mb-6">No real currency is exchanged on this platform. All purchases, cart additions, and inventory logs are simulated via Firebase Firestore for grading purposes.</p>
          
          <h2 className="text-white font-bold uppercase tracking-widest mt-8 mb-4">2. Data & Privacy</h2>
          <p className="mb-6">Authentication is handled securely via Google Firebase. We do not store or sell your personal information. Wishlists and cart data are tied to your unique UID.</p>
        </div>
      </div>
    </div>
  );
}