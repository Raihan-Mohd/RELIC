export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-12 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] border-b border-slate-800 pb-6">Frequently Asked Questions</h1>
        
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm">
            <h2 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-widest">How long does shipping take?</h2>
            <p className="text-slate-400 font-mono text-sm leading-relaxed">Standard items require 5-7 business days for safe transport across realms. Expedited delivery is available at checkout for a premium.</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm">
            <h2 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-widest">Are these items officially licensed?</h2>
            <p className="text-slate-400 font-mono text-sm leading-relaxed">This is a conceptual university portfolio project. While inspired by real games, these items are fictional mockups and are not officially licensed products.</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-sm">
            <h2 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-widest">How does the AI Search work?</h2>
            <p className="text-slate-400 font-mono text-sm leading-relaxed">Our store is powered by Gemini. You can describe what you're looking for in plain English, or upload an image, and the AI will scan our database to find the perfect match.</p>
          </div>
        </div>
      </div>
    </div>
  );
}