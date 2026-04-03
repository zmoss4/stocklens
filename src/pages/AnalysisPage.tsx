import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlinkAuth } from '@blinkdotnew/react';
import { Page, PageHeader, PageTitle, PageDescription, PageBody, PageActions, Button, Card, CardHeader, CardTitle, CardContent, Badge, Skeleton, toast, Banner } from '@blinkdotnew/ui';
import { TrendingUp, TrendingDown, Star, Share2, AlertTriangle, Activity, ChevronDown, ChevronUp, History, Info, ExternalLink } from 'lucide-react';
import { blink } from '../blink/client';
import { motion } from 'framer-motion';

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
import ErrorBoundary from '../components/ErrorBoundary';

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
    <Page className="max-w-7xl mx-auto py-8 px-6 space-y-12 bg-[#030303]">
      <PageHeader className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="shiny-border">
              <Badge variant="outline" className="text-xl font-serif font-medium px-6 py-2 border-none text-white uppercase tracking-tight bg-black">
                {ticker}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Live Compute Active</span>
            </div>
          </div>
          <PageTitle className="text-5xl md:text-7xl font-serif tracking-tighter mb-2">Research Report</PageTitle>
          <PageDescription className="text-lg text-neutral-400 font-light max-w-xl">
            Real-time deterministic intelligence traces across global equity markets and macro indicators.
          </PageDescription>
        </motion.div>
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
          <ErrorBoundary><PriceSection ticker={ticker} /></ErrorBoundary>
          <ErrorBoundary><FundamentalsSection ticker={ticker} /></ErrorBoundary>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ErrorBoundary><RiskSection ticker={ticker} /></ErrorBoundary>
          <ErrorBoundary><TechnicalSection ticker={ticker} /></ErrorBoundary>
          <ErrorBoundary><UnusualSection ticker={ticker} /></ErrorBoundary>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ErrorBoundary><EarningsSection ticker={ticker} /></ErrorBoundary>
          <ErrorBoundary><InstitutionalSection ticker={ticker} /></ErrorBoundary>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ErrorBoundary><NewsSection ticker={ticker} /></ErrorBoundary>
          <ErrorBoundary><MacroSection ticker={ticker} /></ErrorBoundary>
        </div>

        <ErrorBoundary><PeerSection ticker={ticker} /></ErrorBoundary>

        <ErrorBoundary><AIAnalysisSection ticker={ticker} /></ErrorBoundary>

        <footer className="mt-24 text-center text-xs text-muted-foreground/40 border-t border-border/50 pt-8 pb-12">
          <p className="mb-2">StockLens is for educational and informational purposes only. Nothing on this platform constitutes financial advice.</p>
          <p>&copy; 2026 StockLens Platform. All rights reserved.</p>
        </footer>
      </PageBody>
    </Page>
  );
}
