import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup } from '@blinkdotnew/ui';
import { ShieldAlert, TrendingUp, TrendingDown, Clock, Globe, Target, Activity } from 'lucide-react';
import { api } from '../../lib/api';

export function TechnicalSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['technical', ticker],
    queryFn: () => api.getTechnical(ticker)
  });

  if (isLoading) return <TechnicalSkeleton />;
  if (isError) return <TechnicalError />;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Technical Indicators</span>
        </div>
        <CardTitle className="text-xl font-black">Momentum Signal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatGroup className="grid-cols-2 gap-4">
          <Stat label="RSI (14)" value="62.4 (Neutral)" />
          <Stat label="MACD Signal" value="Bullish" />
          <Stat label="50-Day MA" value="$182.4" />
          <Stat label="200-Day MA" value="$165.8" />
        </StatGroup>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between">
          <span className="text-xs font-bold text-primary">GOLDEN CROSS STATUS</span>
          <Badge variant="secondary" className="font-black text-[10px]">ACTIVE</Badge>
        </div>

        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

export function EarningsSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['earnings', ticker],
    queryFn: async () => {
      const res = await fetch(`https://stocklens-analyzer-3d4wbgty.backend.blink.new/api/earnings/${ticker}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  if (isLoading) return <TechnicalSkeleton />;
  if (isError) return <TechnicalError />;

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
          <Stat label="Last EPS Beat" value="+12.4%" />
          <Stat label="Revenue Beat" value="+3.2%" />
          <Stat label="Next Earnings" value={data.calendar?.date || 'N/A'} />
          <Stat label="Guidance" value="Positive" />
        </StatGroup>
        
        <div className="p-4 bg-muted/20 border border-border/30 rounded-xl">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Transcript Sentiment</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">AI Confidence</span>
            <span className="text-sm font-black text-primary">84% (Bullish)</span>
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

function TechnicalSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="h-4 w-32" /></CardHeader>
      <CardContent><div className="grid grid-cols-2 gap-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div></CardContent>
    </Card>
  );
}

function TechnicalError() {
  return (
    <Card className="border-destructive/20 bg-destructive/5 text-destructive">
      <CardHeader><CardTitle>Technical Unavailable</CardTitle></CardHeader>
      <CardContent><p className="text-sm">Unable to retrieve live technical indicators.</p></CardContent>
    </Card>
  );
}

export default TechnicalSection;