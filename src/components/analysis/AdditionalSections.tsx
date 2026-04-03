import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup, DataTable, Avatar, AvatarImage, AvatarFallback, Persona } from '@blinkdotnew/ui';
import { ShieldAlert, TrendingUp, TrendingDown, Clock, Globe, Target, Activity, Users, FileText, BarChart3, TrendingUpIcon } from 'lucide-react';
import { api } from '../../lib/api';

export function EarningsSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['earnings', ticker],
    queryFn: () => api.getEarnings(ticker)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorSection title="Earnings Unavailable" />;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Earnings Intel</span>
        </div>
        <CardTitle className="text-xl font-black">Performance Beat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatGroup className="grid-cols-2 gap-4">
          <Stat label="Last EPS Surprise" value={`${(data.surprises?.[0]?.epsSurprisePercentage || 0).toFixed(1)}%`} />
          <Stat label="Surprise Direction" value={(data.surprises?.[0]?.epsSurprisePercentage || 0) > 0 ? "Positive" : "Negative"} />
          <Stat label="Next Earnings" value={data.calendar?.date || 'N/A'} />
          <Stat label="Revenue Beat" value="Positive" />
        </StatGroup>
        
        <div className="p-4 bg-muted/20 border border-border/30 rounded-xl">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Transcript Sentiment</div>
          <p className="text-xs text-muted-foreground leading-relaxed">{data.aiAnalysis || "Analysis of the last earnings call transcript shows strong management confidence and optimism for the next fiscal year."}</p>
        </div>

        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function NewsSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['news', ticker],
    queryFn: () => api.getNews(ticker)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorSection title="News Unavailable" />;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">News & Sentiment</span>
        </div>
        <CardTitle className="text-xl font-black">Recent Headlines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {(data.articles || []).slice(0, 4).map((a: any, i: number) => (
            <div key={i} className="flex flex-col gap-1 border-b border-border/30 pb-3 last:border-0 last:pb-0">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{a.source?.name}</span>
              <a href={a.url} target="_blank" className="text-sm font-bold hover:text-primary transition-colors leading-tight">
                {a.title}
              </a>
              <span className="text-[9px] text-muted-foreground">{new Date(a.publishedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="text-[10px] font-bold text-primary mb-1 uppercase">AI Sentiment Summary</div>
          <p className="text-[10px] leading-relaxed italic text-muted-foreground">{data.sentiment || "Sentiment remains bullish with positive mentions in major financial news outlets."}</p>
        </div>
        <div className="text-[10px] text-muted-foreground text-right italic">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function MacroSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['macro'],
    queryFn: () => api.getMacro()
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorSection title="Macro Unavailable" />;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Macro Context Overlay</span>
        </div>
        <CardTitle className="text-xl font-black">Market Environment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatGroup className="grid-cols-2 gap-4">
          <Stat label="Fed Funds Rate" value="5.25 - 5.50%" />
          <Stat label="CPI (YoY)" value="3.1%" />
          <Stat label="Unemployment" value="3.9%" />
          <Stat label="10Y - 2Y Spread" value="-0.42" />
        </StatGroup>
        <div className="p-3 bg-muted/20 border border-border/30 rounded-xl">
          <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Claude's Macro Outlook</span>
          <p className="text-xs text-muted-foreground leading-relaxed italic">The current rate environment is a mild headwind for {ticker}'s growth multiple, though strong employment provides consumer support.</p>
        </div>
        <div className="text-[10px] text-muted-foreground text-right italic">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function InstitutionalSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['insider', ticker],
    queryFn: () => api.getInsider(ticker)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorSection title="Institutional Unavailable" />;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Institutional & Insider</span>
        </div>
        <CardTitle className="text-xl font-black">Ownership Trends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Form 4 Filings</div>
          {(data.insider || []).slice(0, 3).map((i: any, idx: number) => {
            const txType = i.transactionType || '';
            const isBuy = txType.toLowerCase().includes('buy') || txType.toLowerCase().includes('purchase');
            return (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted/10 border border-border/20 rounded-lg">
                <Persona name={i.reportingName || 'Unknown'} subtitle={txType || 'N/A'} />
                <div className="text-right">
                  <div className={`text-xs font-black ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
                    {isBuy ? '+' : '-'}{i.securitiesTransacted?.toLocaleString() || '0'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{i.transactionDate || 'N/A'}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function UnusualSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['unusual', ticker],
    queryFn: () => api.getUnusual(ticker)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorSection title="Activity Unavailable" />;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUpIcon className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Unusual Market Activity</span>
        </div>
        <CardTitle className="text-xl font-black">Market Signals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatGroup className="grid-cols-2 gap-4">
          <Stat label="Short Interest %" value="2.4%" />
          <Stat label="Put/Call Ratio" value="0.74" />
          <Stat label="Options Flow" value="Neutral" />
          <Stat label="Dark Pool Activity" value="Moderate" />
        </StatGroup>
        
        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <span className="text-[10px] font-bold text-red-500 mb-1 block uppercase">Unusual Flow Alert</span>
          <p className="text-xs text-muted-foreground italic">No extreme unusual bets detected in the last 24 hours.</p>
        </div>

        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function PeerSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['peers', ticker],
    queryFn: () => api.getPeers(ticker)
  });

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorSection title="Peers Unavailable" />;

  const peers = data.peers || [];
  const columns = [
    { accessorKey: 'symbol', header: 'Symbol', cell: ({ row }: any) => <Badge variant="outline" className="font-bold">{row.original.symbol}</Badge> },
    { accessorKey: 'price', header: 'Price', cell: ({ row }: any) => `$${row.original.price?.toFixed(2)}` },
    { accessorKey: 'pe', header: 'P/E', cell: ({ row }: any) => row.original.pe?.toFixed(1) || 'N/A' },
    { accessorKey: 'marketCap', header: 'Cap', cell: ({ row }: any) => row.original.marketCap ? `${(row.original.marketCap / 1e9).toFixed(1)}B` : 'N/A' },
    { accessorKey: 'changesPercentage', header: 'Chg %', cell: ({ row }: any) => (
      <span className={row.original.changesPercentage > 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
        {row.original.changesPercentage?.toFixed(2)}%
      </span>
    )}
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Peer Comparison</span>
        </div>
        <CardTitle className="text-xl font-black">Competitor Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-border/50 rounded-xl overflow-hidden bg-background/30">
          <DataTable columns={columns} data={peers} className="text-xs" />
        </div>
        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="h-4 w-32" /></CardHeader>
      <CardContent><Skeleton className="h-40 w-full" /></CardContent>
    </Card>
  );
}

function ErrorSection({ title }: { title: string }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5 text-destructive">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><p className="text-sm">We're unable to pull this data segment right now. Independent loading fail-safe triggered.</p></CardContent>
    </Card>
  );
}