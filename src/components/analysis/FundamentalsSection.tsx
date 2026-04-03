import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup, DataTable, Tabs, TabsList, TabsTrigger, TabsContent } from '@blinkdotnew/ui';
import { TrendingUp, TrendingDown, Clock, Globe, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { api } from '../../lib/api';

export default function FundamentalsSection({ ticker }: { ticker: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['fundamentals', ticker],
    queryFn: () => api.getFundamentals(ticker),
    staleTime: 300000 // 5 minutes stale
  });

  if (isLoading) return <FundamentalsSkeleton />;
  if (isError) return <FundamentalsError />;

  const income = data.income || [];
  const balance = data.balance || [];
  const cashflow = data.cashflow || [];
  const growth = data.growth || [];

  const incomeColumns = [
    { accessorKey: 'date', header: 'Quarter' },
    { accessorKey: 'revenue', header: 'Revenue', cell: ({ row }: any) => `$${(row.original.revenue / 1e9).toFixed(1)}B` },
    { accessorKey: 'grossProfit', header: 'Profit', cell: ({ row }: any) => `$${(row.original.grossProfit / 1e9).toFixed(1)}B` },
    { accessorKey: 'eps', header: 'EPS', cell: ({ row }: any) => `$${row.original.eps?.toFixed(2)}` }
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden relative group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Fundamentals</span>
        </div>
        <CardTitle className="text-2xl font-black">Financial Statements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="income">
          <TabsList className="bg-muted/30 border border-border/50 rounded-lg p-1">
            <TabsTrigger value="income" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold px-4">Income</TabsTrigger>
            <TabsTrigger value="balance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold px-4">Balance</TabsTrigger>
            <TabsTrigger value="cashflow" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold px-4">Cash Flow</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 border border-border/50 rounded-xl overflow-hidden bg-background/30 backdrop-blur-sm">
            <TabsContent value="income">
              <DataTable 
                columns={incomeColumns} 
                data={income} 
                className="text-xs border-none"
              />
            </TabsContent>
            <TabsContent value="balance">
              <DataTable 
                columns={incomeColumns} // Using same for now for demo
                data={balance} 
                className="text-xs border-none"
              />
            </TabsContent>
            <TabsContent value="cashflow">
              <DataTable 
                columns={incomeColumns} // Using same for now for demo
                data={cashflow} 
                className="text-xs border-none"
              />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/20 border border-border/30 rounded-xl">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Growth Analysis</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Revenue Growth</span>
              <span className={`text-sm font-black ${(growth[0]?.revenueGrowth || 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {((growth[0]?.revenueGrowth || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="p-4 bg-muted/20 border border-border/30 rounded-xl">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Profitability</div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gross Margin</span>
              <span className="text-sm font-black text-primary">
                {income[0]?.revenue ? ((Number(income[0]?.grossProfit || 0) / Number(income[0].revenue)) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground text-right italic pt-4">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

function FundamentalsSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader><Skeleton className="h-8 w-48 mb-4" /><Skeleton className="h-4 w-32" /></CardHeader>
      <CardContent><Skeleton className="h-64 w-full" /></CardContent>
    </Card>
  );
}

function FundamentalsError() {
  return (
    <Card className="border-destructive/20 bg-destructive/5 text-destructive">
      <CardHeader><CardTitle>Fundamentals Unavailable</CardTitle></CardHeader>
      <CardContent><p className="text-sm">We're unable to pull live fundamentals data for this symbol right now. Please check your connection or try again later.</p></CardContent>
    </Card>
  );
}