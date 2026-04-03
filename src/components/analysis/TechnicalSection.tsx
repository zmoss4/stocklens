import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup } from '@blinkdotnew/ui';
import { Activity } from 'lucide-react';
import { api } from '../../lib/api';

export default function TechnicalSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['technical', ticker],
    queryFn: () => api.getTechnical(ticker)
  });

  if (isLoading) return <TechnicalSkeleton />;
  if (isError || !data) return <TechnicalError />;

  // Parse RSI from Alpha Vantage response
  const rsiData = data.rsi?.['Technical Analysis: RSI'];
  const latestRsiDate = rsiData ? Object.keys(rsiData)[0] : null;
  const rsiValue = latestRsiDate ? Number(rsiData[latestRsiDate]?.RSI || 0).toFixed(1) : 'N/A';

  // Parse MACD
  const macdData = data.macd?.['Technical Analysis: MACD'];
  const latestMacdDate = macdData ? Object.keys(macdData)[0] : null;
  const macdSignal = latestMacdDate ? (Number(macdData[latestMacdDate]?.MACD_Hist || 0) > 0 ? 'Bullish' : 'Bearish') : 'N/A';

  // Parse SMA values
  const sma50Data = data.sma50?.['Technical Analysis: SMA'];
  const latestSma50Date = sma50Data ? Object.keys(sma50Data)[0] : null;
  const sma50Value = latestSma50Date ? `$${Number(sma50Data[latestSma50Date]?.SMA || 0).toFixed(2)}` : 'N/A';

  const sma200Data = data.sma200?.['Technical Analysis: SMA'];
  const latestSma200Date = sma200Data ? Object.keys(sma200Data)[0] : null;
  const sma200Value = latestSma200Date ? `$${Number(sma200Data[latestSma200Date]?.SMA || 0).toFixed(2)}` : 'N/A';

  // Determine RSI label
  const rsiNum = Number(rsiValue);
  const rsiLabel = isNaN(rsiNum) ? '' : rsiNum > 70 ? ' (Overbought)' : rsiNum < 30 ? ' (Oversold)' : ' (Neutral)';

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
          <Stat label="RSI (14)" value={`${rsiValue}${rsiLabel}`} />
          <Stat label="MACD Signal" value={macdSignal} />
          <Stat label="50-Day MA" value={sma50Value} />
          <Stat label="200-Day MA" value={sma200Value} />
        </StatGroup>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between">
          <span className="text-xs font-bold text-primary">GOLDEN CROSS STATUS</span>
          <Badge variant="secondary" className="font-black text-[10px]">
            {sma50Value !== 'N/A' && sma200Value !== 'N/A' && Number(sma50Value.replace('$', '')) > Number(sma200Value.replace('$', '')) ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </div>

        {data.timestamp && (
          <div className="text-[10px] text-muted-foreground text-right italic pt-4">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        )}
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
