import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup } from '@blinkdotnew/ui';
import { TrendingUp, TrendingDown, Clock, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '../../lib/api';

export default function PriceSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['price', ticker],
    queryFn: () => api.getPriceValuation(ticker),
    staleTime: 60000 
  });

  if (isLoading) return <PriceSkeleton />;
  if (isError) return <PriceError />;

  const quote = data.price || {};
  const isUp = quote.change > 0;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Price & Valuation</span>
        </div>
        <div className="flex items-baseline gap-4">
          <CardTitle className="text-4xl font-black">${quote.price?.toFixed(2)}</CardTitle>
          <div className={`flex items-center text-lg font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {isUp ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
            {quote.change?.toFixed(2)} ({quote.changesPercentage?.toFixed(2)}%)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <StatGroup className="grid-cols-2 md:grid-cols-3 gap-6">
          <Stat label="Market Cap" value={`$${(quote.marketCap / 1e9).toFixed(2)}B`} />
          <Stat label="P/E Ratio" value={quote.pe?.toFixed(2) || 'N/A'} />
          <Stat label="52W High" value={`$${quote.yearHigh?.toFixed(2)}`} />
          <Stat label="52W Low" value={`$${quote.yearLow?.toFixed(2)}`} />
          <Stat label="Volume" value={(quote.volume / 1e6).toFixed(1) + 'M'} />
          <Stat label="Avg Vol" value={(quote.avgVolume / 1e6).toFixed(1) + 'M'} />
        </StatGroup>
        
        <div className="mt-6 pt-6 border-t border-border/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Valuation Grade</span>
            <Badge variant={quote.pe < 25 ? 'secondary' : 'outline'} className="font-black text-xs">
              {quote.pe < 25 ? 'UNDERVALUED' : 'PREMIUM'}
            </Badge>
          </div>
          <div className="text-[10px] text-muted-foreground text-right italic">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader><Skeleton className="h-10 w-48 mb-4" /><Skeleton className="h-6 w-32" /></CardHeader>
      <CardContent><div className="grid grid-cols-3 gap-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></CardContent>
    </Card>
  );
}

function PriceError() {
  return (
    <Card className="border-destructive/20 bg-destructive/5 text-destructive">
      <CardHeader><CardTitle>Price Data Unavailable</CardTitle></CardHeader>
      <CardContent><p className="text-sm">We're unable to pull live price data for this symbol right now. Please check your connection or try again later.</p></CardContent>
    </Card>
  );
}
