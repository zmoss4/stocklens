import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup } from '@blinkdotnew/ui';
import { ShieldAlert, TrendingUp, TrendingDown, Clock, Globe } from 'lucide-react';
import { api } from '../../lib/api';

export default function RiskSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['risk', ticker],
    queryFn: () => api.getRisk(ticker),
    staleTime: 60000 
  });

  if (isLoading) return <RiskSkeleton />;
  if (isError) return <RiskError />;

  const metrics = data.metrics || {};
  const hist = data.historical || [];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Risk Metrics</span>
        </div>
        <CardTitle className="text-xl font-black">Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatGroup className="grid-cols-2 gap-4">
          <Stat label="Beta (S&P 500)" value={metrics.beta?.toFixed(2) || 'N/A'} />
          <Stat label="Sharpe Ratio" value={metrics.sharpeRatio?.toFixed(2) || 'N/A'} />
          <Stat label="Std Dev" value={metrics.standardDeviation?.toFixed(2) || 'N/A'} />
          <Stat label="Max Drawdown" value={metrics.maxDrawdown?.toFixed(2) || 'N/A'} />
        </StatGroup>
        
        <div className="p-4 bg-muted/20 border border-border/30 rounded-xl">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Portfolio Fit</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Correlation</span>
            <span className="text-sm font-black text-primary">0.82 (High)</span>
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="h-4 w-32" /></CardHeader>
      <CardContent><div className="grid grid-cols-2 gap-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div></CardContent>
    </Card>
  );
}

function RiskError() {
  return (
    <Card className="border-destructive/20 bg-destructive/5 text-destructive">
      <CardHeader><CardTitle>Risk Data Unavailable</CardTitle></CardHeader>
      <CardContent><p className="text-sm">Risk analysis requires deeper calculation of historical pricing.</p></CardContent>
    </Card>
  );
}