export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-12 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] border-b border-slate-800 pb-6">About Relic</h1>
        
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-sm">
          <p className="text-slate-300 font-mono text-sm leading-relaxed mb-6">
            Relic was forged from a simple idea: gamers deserve high-quality, physical representations of the digital worlds they love. 
          </p>
          <p className="text-slate-300 font-mono text-sm leading-relaxed mb-6">
            Built as an advanced e-commerce platform, this project showcases the integration of Next.js, Firebase cloud databases, and cutting-edge Google Gemini Multimodal AI.
          </p>
          <p className="text-slate-300 font-mono text-sm leading-relaxed">
            Whether you are looking for a sword to mount on your wall, or a neon sign to light up your desk, we bring the game to you.
          </p>
        </div>
      </div>
    </div>
  );
}