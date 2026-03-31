import { blink } from '../blink/client';

const BACKEND_URL = `https://stocklens-analyzer-3d4wbgty.backend.blink.new`;

export const api = {
  getPriceValuation: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/price-valuation/${ticker}`);
    if (!res.ok) throw new Error('Price data unavailable');
    return res.json();
  },
  getFundamentals: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/fundamentals/${ticker}`);
    if (!res.ok) throw new Error('Fundamentals unavailable');
    return res.json();
  },
  getRisk: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/risk/${ticker}`);
    if (!res.ok) throw new Error('Risk metrics unavailable');
    return res.json();
  },
  getTechnical: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/technical/${ticker}`);
    if (!res.ok) throw new Error('Technicals unavailable');
    return res.json();
  },
  getEarnings: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/earnings/${ticker}`);
    if (!res.ok) throw new Error('Earnings data unavailable');
    return res.json();
  },
  getNews: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/news/${ticker}`);
    if (!res.ok) throw new Error('News unavailable');
    return res.json();
  },
  getMacro: async () => {
    const res = await fetch(`${BACKEND_URL}/api/macro`);
    if (!res.ok) throw new Error('Macro data unavailable');
    return res.json();
  },
  getInsider: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/insider/${ticker}`);
    if (!res.ok) throw new Error('Insider data unavailable');
    return res.json();
  },
  getUnusual: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/unusual/${ticker}`);
    if (!res.ok) throw new Error('Unusual activity data unavailable');
    return res.json();
  },
  getPeers: async (ticker: string) => {
    const res = await fetch(`${BACKEND_URL}/api/peers/${ticker}`);
    if (!res.ok) throw new Error('Peers data unavailable');
    return res.json();
  },
  aiAnalyze: async (ticker: string, data: any) => {
    const res = await fetch(`${BACKEND_URL}/api/ai-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker, data })
    });
    if (!res.ok) throw new Error('AI analysis engine offline');
    return res.json();
  }
};
