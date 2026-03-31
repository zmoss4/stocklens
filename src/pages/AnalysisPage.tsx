import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlinkAuth } from '@blinkdotnew/react';
import { Page, PageHeader, PageTitle, PageDescription, PageBody, PageActions, Button, Card, CardHeader, CardTitle, CardContent, Badge, Skeleton, toast, Banner } from '@blinkdotnew/ui';
import { TrendingUp, TrendingDown, Star, Share2, AlertTriangle, Activity, ChevronDown, ChevronUp, History, Info, ExternalLink } from 'lucide-react';
import { blink } from '../blink/client';

// Section Components
import PriceSection from '../components/analysis/PriceSection';
import FundamentalsSection from '../components/analysis/FundamentalsSection';
import RiskSection from '../components/analysis/RiskSection';
import TechnicalSection from '../components/analysis/TechnicalSection';
import { 
  EarningsSection, 
  NewsSection, 
  MacroSection, 
  InstitutionalSection, 
  UnusualSection, 
  PeerSection 
} from '../components/analysis/AdditionalSections';
import AIAnalysisSection from '../components/analysis/AIAnalysisSection';

export default function AnalysisPage() {
  const { ticker } = useParams({ from: '/analysis/$ticker' });
  const { user, isAuthenticated } = useBlinkAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Watchlist status
  const { data: watchlistItem } = useQuery({
    queryKey: ['watchlist', ticker, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const res = await blink.db.watchlist.list({
        where: { user_id: user.id, ticker: ticker }
      });
      return res[0] || null;
    },
    enabled: !!user
  });

  const toggleWatchlist = useMutation({
    mutationFn: async () => {
      if (!user) {
        blink.auth.login();
        return;
      }
      if (watchlistItem) {
        await blink.db.watchlist.delete(watchlistItem.id);
      } else {
        await blink.db.watchlist.create({
          user_id: user.id,
          ticker: ticker
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', ticker, user?.id] });
      toast.success(watchlistItem ? 'Removed from watchlist' : 'Added to watchlist');
    }
  });

  return (
    <Page className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <PageHeader className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="text-xl font-bold px-4 py-1.5 border-primary/30 text-primary uppercase">
              {ticker}
            </Badge>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <PageTitle className="text-4xl font-black mb-1">Interactive Research Report</PageTitle>
          <PageDescription className="text-lg">
            Real-time multi-source analysis engine. Pulling live data from FMP, Alpha Vantage, Polygon, and FRED.
          </PageDescription>
        </div>
        <PageActions className="flex items-center gap-3">
          <Button 
            variant={watchlistItem ? "secondary" : "outline"} 
            size="lg" 
            onClick={() => toggleWatchlist.mutate()}
            className="rounded-xl font-bold"
          >
            <Star className={`w-5 h-5 mr-2 ${watchlistItem ? 'fill-primary text-primary' : ''}`} />
            {watchlistItem ? 'In Watchlist' : 'Add to Watchlist'}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-xl font-bold"
            onClick={() => toast.success('Share link copied!')}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Report
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="rounded-xl font-bold"
            onClick={() => navigate({ to: '/history/$ticker', params: { ticker } })}
          >
            <History className="w-5 h-5 mr-2" />
            History
          </Button>
        </PageActions>
      </PageHeader>

      <PageBody className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PriceSection ticker={ticker} />
          <FundamentalsSection ticker={ticker} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RiskSection ticker={ticker} />
          <TechnicalSection ticker={ticker} />
          <UnusualSection ticker={ticker} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EarningsSection ticker={ticker} />
          <InstitutionalSection ticker={ticker} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NewsSection ticker={ticker} />
          <MacroSection ticker={ticker} />
        </div>

        <PeerSection ticker={ticker} />

        <AIAnalysisSection ticker={ticker} />

        <footer className="mt-24 text-center text-xs text-muted-foreground/40 border-t border-border/50 pt-8 pb-12">
          <p className="mb-2">StockLens is for educational and informational purposes only. Nothing on this platform constitutes financial advice.</p>
          <p>&copy; 2026 StockLens Platform. All rights reserved.</p>
        </footer>
      </PageBody>
    </Page>
  );
}