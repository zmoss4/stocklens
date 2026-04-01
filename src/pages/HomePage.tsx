import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Cpu, Shield, Zap, Globe, Terminal, ArrowRight, Activity, BarChart3, Lock } from 'lucide-react';
import { Input, Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@blinkdotnew/ui';

export default function HomePage() {
  const [ticker, setTicker] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      navigate({ to: '/analysis/$ticker', params: { ticker: ticker.toUpperCase() } });
    }
  };

  const tickerItems = [
    { label: "NVDA", value: "$840.35", change: "+4.2%" },
    { label: "AAPL", value: "$172.50", change: "-0.8%" },
    { label: "TSLA", value: "$175.22", change: "+1.2%" },
    { label: "BTC", value: "$64,240", change: "+2.5%" },
    { label: "ETH", value: "$3,420", change: "+1.8%" },
    { label: "MSFT", value: "$415.30", change: "-0.2%" },
  ];

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-violet-500" />,
      title: "Real-time AI Compute",
      description: "Proprietary models analyze live exchange feeds with zero training lag."
    },
    {
      icon: <Shield className="w-6 h-6 text-cyan-500" />,
      title: "Audit Trail",
      description: "Every rating is backed by a deterministic trace of verified data points."
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      title: "Millisecond Latency",
      description: "Global edge execution ensures your reports are ready before the next tick."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-violet-500/30">
      {/* Floating Nav Pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl glass rounded-full px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
          <span className="font-serif font-medium text-lg tracking-tight">Synapse</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Platform</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Research</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Enterprise</a>
        </div>
        <button className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
          Get Started
        </button>
      </nav>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="font-serif text-6xl md:text-9xl leading-[0.9] tracking-tighter mb-8">
              Analyze the market in <br />
              <span className="shimmer-text">real-time.</span>
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
              Stop relying on static training data. Synapse executes live intelligence 
              across global markets with verifiable AI audit trails.
            </p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <Input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="Enter ticker symbol (e.g. NVDA)"
                  className="h-16 px-6 glass rounded-2xl text-xl border-white/5 focus-visible:ring-violet-500/50"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-2 h-12 px-8 rounded-xl bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200"
                >
                  Analyze
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Ambient Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-[600px] overflow-hidden">
            <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-violet-600/10 blur-[120px] animate-float" />
            <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-cyan-600/10 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </section>

        {/* Metrics Ticker */}
        <div className="mt-32 border-y border-white/5 bg-black/40 py-4 overflow-hidden relative">
          <div className="flex animate-ticker whitespace-nowrap gap-16 items-center">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">{item.label}</span>
                <span className="text-base font-mono font-medium">{item.value}</span>
                <span className={`text-[10px] font-mono font-bold ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{item.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-32 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group p-10 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:-translate-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-serif text-2xl mb-4">{f.title}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Code Block Integration */}
        <section className="mt-32 px-6 max-w-5xl mx-auto">
          <div className="glass rounded-3xl overflow-hidden border-white/10 shadow-2xl">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
              <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3 h-3" /> synapse_intelligence.ts
              </div>
              <div className="w-4 h-4" />
            </div>
            <div className="p-8 md:p-12 font-mono text-sm leading-relaxed overflow-x-auto">
              <pre>
                <code className="text-violet-400">import</code> <code className="text-white">{`{ AnalysisEngine }`}</code> <code className="text-violet-400">from</code> <code className="text-emerald-400">"@synapse/core"</code><code className="text-white">;</code><br />
                <br />
                <code className="text-violet-400">const</code> <code className="text-white">engine = </code><code className="text-violet-400">new</code> <code className="text-cyan-400">AnalysisEngine</code><code className="text-white">({`{`}</code><br />
                <code className="text-white">  strategy: </code><code className="text-emerald-400">"deterministic_audit"</code><code className="text-white">,</code><br />
                <code className="text-white">  latency: </code><code className="text-emerald-400">"sub_millisecond"</code><br />
                <code className="text-white">{`})`};</code><br />
                <br />
                <code className="text-neutral-500">{`// Execute live analysis with AI verification`}</code><br />
                <code className="text-violet-400">const</code> <code className="text-white">result = </code><code className="text-violet-400">await</code> <code className="text-white">engine.</code><code className="text-cyan-400">analyze</code><code className="text-white">(</code><code className="text-emerald-400">"NVDA"</code><code className="text-white">);</code><br />
                <br />
                <code className="text-white">console</code><code className="text-cyan-400">log</code><code className="text-white">(result.intelligence_score); </code><code className="text-neutral-500">{`// 98.4`}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050505] pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500" />
              <span className="font-serif font-medium text-2xl tracking-tight">Synapse</span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              The next generation of financial intelligence, powered by verifiable AI.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">Analyzer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Real-time Feed</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
          <span className="text-xs text-neutral-600 font-medium">© 2026 StockLens Intelligence Platform.</span>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}