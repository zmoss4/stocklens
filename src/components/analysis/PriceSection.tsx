import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup } from '@blinkdotnew/ui';
import { Clock, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '../../lib/api';

function safeNum(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

function formatLarge(val: any): string {
  const n = safeNum(val);
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

export default function PriceSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['price', ticker],
    queryFn: () => api.getPriceValuation(ticker),
    staleTime: 60000
  });

  if (isLoading) return <PriceSkeleton />;
  if (isError || !data) return <PriceError />;

  const quote = data.price || {};
  const price = safeNum(quote.price);
  const change = safeNum(quote.change);
  const changePct = safeNum(quote.changesPercentage);
  const isUp = change >= 0;

  return (
    <Card className="border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
        <Clock className="w-4 h-4 text-neutral-500" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-violet-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500/70">Price & Valuation</span>
        </div>
        <div className="flex items-baseline gap-4">
          <CardTitle className="text-4xl font-black">${price.toFixed(2)}</CardTitle>
          <div className={`flex items-center text-lg font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {isUp ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
            {change.toFixed(2)} ({changePct.toFixed(2)}%)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <StatGroup className="grid-cols-2 md:grid-cols-3 gap-6">
          <Stat label="Market Cap" value={formatLarge(quote.marketCap)} />
          <Stat label="P/E Ratio" value={quote.pe ? safeNum(quote.pe).toFixed(2) : 'N/A'} />
          <Stat label="52W High" value={quote.yearHigh ? `$${safeNum(quote.yearHigh).toFixed(2)}` : 'N/A'} />
          <Stat label="52W Low" value={quote.yearLow ? `$${safeNum(quote.yearLow).toFixed(2)}` : 'N/A'} />
          <Stat label="Volume" value={quote.volume ? `${(safeNum(quote.volume) / 1e6).toFixed(1)}M` : 'N/A'} />
          <Stat label="Avg Vol" value={quote.avgVolume ? `${(safeNum(quote.avgVolume) / 1e6).toFixed(1)}M` : 'N/A'} />
        </StatGroup>

        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Valuation Grade</span>
            <Badge variant={quote.pe && safeNum(quote.pe) < 25 ? 'secondary' : 'outline'} className="font-black text-xs">
              {quote.pe ? (safeNum(quote.pe) < 25 ? 'UNDERVALUED' : 'PREMIUM') : 'N/A'}
            </Badge>
          </div>
          {data.timestamp && (
            <div className="text-[10px] text-neutral-600 text-right italic">
              Last updated: {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PriceSkeleton() {
  return (
    <Card className="border-white/5 bg-white/[0.02]">
      <CardHeader><Skeleton className="h-10 w-48 mb-4" /><Skeleton className="h-6 w-32" /></CardHeader>
      <CardContent><div className="grid grid-cols-3 gap-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></CardContent>
    </Card>
  );
}

function PriceError() {
  return (
    <Card className="border-red-500/10 bg-red-500/5">
      <CardHeader><CardTitle className="text-red-400">Price Data Unavailable</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-neutral-400">Unable to pull live price data. Check your API keys in Project Settings → Secrets.</p></CardContent>
    </Card>
  );
}
