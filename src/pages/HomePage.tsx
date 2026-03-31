import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Page, PageHeader, PageTitle, PageDescription, PageBody, Input, Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@blinkdotnew/ui';
import { Search, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export default function HomePage() {
  const [ticker, setTicker] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      navigate({ to: '/analysis/$ticker', params: { ticker: ticker.toUpperCase() } });
    }
  };

  const trending = ['AAPL', 'TSLA', 'NVDA', 'AMZN', 'MSFT', 'META'];

  return (
    <Page className="max-w-4xl mx-auto py-12 px-6">
      <PageHeader className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
            <TrendingUp className="w-12 h-12 text-primary" />
          </div>
        </div>
        <PageTitle className="text-5xl font-extrabold tracking-tight mb-4">StockLens</PageTitle>
        <PageDescription className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional-grade financial analysis platform. Live data. AI-driven insights. 
          Zero cached data. Zero latency reports.
        </PageDescription>
      </PageHeader>
      
      <PageBody>
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-16">
          <Input 
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Search symbol (e.g. AAPL, NVDA, TSLA)" 
            className="h-16 pl-14 pr-32 text-xl font-medium border-border/50 bg-card/50 backdrop-blur-md rounded-2xl shadow-2xl focus-visible:ring-primary/20"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all"
          >
            Analyze
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-md hover:border-primary/20 transition-all cursor-pointer overflow-hidden group">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Activity className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Live Market Signals</span>
              </div>
              <CardTitle>Trending Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <Badge 
                    key={t} 
                    variant="outline" 
                    className="px-4 py-2 text-sm font-bold hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => navigate({ to: '/analysis/$ticker', params: { ticker: t } })}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-md hover:border-primary/20 transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-2 text-secondary-foreground mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Historical Tracking</span>
              </div>
              <CardTitle>Grade Longevity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                StockLens tracks proprietary grade history over time, allowing you to see how 
                AI sentiment and analyst trends evolve across market cycles.
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-24 text-center text-xs text-muted-foreground/40 border-t border-border/50 pt-8">
          StockLens is for educational and informational purposes only. Nothing on this platform constitutes financial advice.
        </footer>
      </PageBody>
    </Page>
  );
}
