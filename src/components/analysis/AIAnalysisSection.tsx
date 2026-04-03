import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Badge, Stat, StatGroup, Banner, Button, LoadingOverlay } from '@blinkdotnew/ui';
import { Sparkles, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Info, ChevronRight, Activity, Globe, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api';
import { blink } from '../../blink/client';

export default function AIAnalysisSection({ ticker }: { ticker: string }) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Gather all data
  const priceData = queryClient.getQueryData(['price', ticker]);
  const fundamentalsData = queryClient.getQueryData(['fundamentals', ticker]);
  const riskData = queryClient.getQueryData(['risk', ticker]);
  const technicalData = queryClient.getQueryData(['technical', ticker]);
  const earningsData = queryClient.getQueryData(['earnings', ticker]);
  const newsData = queryClient.getQueryData(['news', ticker]);
  const macroData = queryClient.getQueryData(['macro']);
  const institutionalData = queryClient.getQueryData(['insider', ticker]);
  const unusualData = queryClient.getQueryData(['unusual', ticker]);
  const peersData = queryClient.getQueryData(['peers', ticker]);

  const allDataLoaded = priceData && fundamentalsData && riskData && technicalData && earningsData && newsData && macroData && institutionalData && unusualData && peersData;

  const { data, mutate, isPending, isError } = useMutation({
    mutationFn: (payload: any) => api.aiAnalyze(ticker, payload),
    onSuccess: async (analysisData) => {
      // Save to historical grades and reports
      await blink.db.historical_grades.create({
        id: crypto.randomUUID(),
        ticker,
        grade: analysisData.grade,
        verdict: analysisData.verdict,
        confidence_score: analysisData.confidenceScore,
        data_points: JSON.stringify(analysisData.auditTrail)
      });
      await blink.db.reports.create({
        id: crypto.randomUUID(),
        ticker,
        data: JSON.stringify(analysisData)
      });
    }
  });

  useEffect(() => {
    if (allDataLoaded && !data && !isPending && !isAnalyzing) {
      setIsAnalyzing(true);
      mutate({
        price: priceData,
        fundamentals: fundamentalsData,
        risk: riskData,
        technical: technicalData,
        earnings: earningsData,
        news: newsData,
        macro: macroData,
        institutional: institutionalData,
        unusual: unusualData,
        peers: peersData
      });
    }
  }, [allDataLoaded, data, isPending, isAnalyzing, ticker, priceData, fundamentalsData, riskData, technicalData, earningsData, newsData, macroData, institutionalData, unusualData, peersData, mutate]);

  if (!allDataLoaded || isPending) return <AIAnalysisSkeleton />;
  if (isError) return <AIAnalysisError />;
  if (!data) return null;

  const gradeColors: Record<string, string> = {
    'A+': 'text-green-500 border-green-500',
    'A': 'text-green-500 border-green-500',
    'A-': 'text-green-500 border-green-500',
    'B+': 'text-blue-500 border-blue-500',
    'B': 'text-blue-500 border-blue-500',
    'B-': 'text-blue-500 border-blue-500',
    'C+': 'text-yellow-500 border-yellow-500',
    'C': 'text-yellow-500 border-yellow-500',
    'C-': 'text-yellow-500 border-yellow-500',
    'D+': 'text-orange-500 border-orange-500',
    'D': 'text-orange-500 border-orange-500',
    'F': 'text-red-500 border-red-500',
  };

  const verdictColors: Record<string, string> = {
    'Bullish': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Neutral': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Bearish': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-black uppercase tracking-tighter">AI Comprehensive Report</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Grade & Verdict */}
        <Card className="lg:col-span-1 border-primary/20 bg-primary/5 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <CardHeader className="text-center pb-8 border-b border-primary/10">
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Final Assessment</div>
            <div className={`text-[120px] font-black leading-none mb-4 ${gradeColors[data.grade] || 'text-primary'}`}>
              {data.grade}
            </div>
            <Badge variant="outline" className={`text-xl font-black px-8 py-2 rounded-full border-2 ${verdictColors[data.verdict] || ''}`}>
              {data.verdict}
            </Badge>
          </CardHeader>
          <CardContent className="pt-8">
            <StatGroup className="grid-cols-2 gap-4">
              <Stat label="Confidence Score" value={`${data.confidenceScore}%`} />
              <Stat label="Risk Rating" value={data.riskFlags?.length > 3 ? 'High' : 'Moderate'} />
            </StatGroup>
            
            <div className="mt-8 pt-8 border-t border-primary/10">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">12-Month Price Targets</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-green-500/5 p-3 rounded-xl border border-green-500/10">
                  <span className="text-xs font-bold text-green-500">Bull Case</span>
                  <span className="text-lg font-black text-green-500">{data.priceTarget?.bull}</span>
                </div>
                <div className="flex justify-between items-center bg-primary/5 p-3 rounded-xl border border-primary/10">
                  <span className="text-xs font-bold text-primary">Base Case</span>
                  <span className="text-lg font-black text-primary">{data.priceTarget?.base}</span>
                </div>
                <div className="flex justify-between items-center bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                  <span className="text-xs font-bold text-red-500">Bear Case</span>
                  <span className="text-lg font-black text-red-500">{data.priceTarget?.bear}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/50 bg-card/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-black uppercase tracking-tight">Executive Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-xl font-medium leading-relaxed mb-8 text-foreground">
                {data.summary}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div>
                  <div className="flex items-center gap-2 text-green-500 font-black text-sm uppercase tracking-widest mb-4">
                    <TrendingUp className="w-4 h-4" /> Bull Case
                  </div>
                  <ul className="space-y-3">
                    {data.bullCase?.map((b: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="text-green-500 font-bold">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-red-500 font-black text-sm uppercase tracking-widest mb-4">
                    <TrendingDown className="w-4 h-4" /> Bear Case
                  </div>
                  <ul className="space-y-3">
                    {data.bearCase?.map((b: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="text-red-500 font-bold">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-black uppercase tracking-tight">Analyst Note</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none italic text-lg leading-relaxed text-muted-foreground">
                "{data.analystTake}"
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confidence Audit Trail */}
      <Card className="border-border/50 bg-muted/10 overflow-hidden mt-12">
        <CardHeader className="bg-background/50 border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-black uppercase tracking-tight">Confidence Audit Trail</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            This audit trail lists exactly which specific data points drove the overall grade. 
            All insights are generated from live data pulls made at the time of analysis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.auditTrail?.map((a: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-background/50 border border-border/50 rounded-xl hover:border-primary/30 transition-all">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium leading-tight">{a}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AIAnalysisSkeleton() {
  return (
    <div className="space-y-8 mt-12 opacity-50">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-[500px] w-full rounded-2xl" />
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-[150px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function AIAnalysisError() {
  return (
    <Banner variant="error" title="AI Analysis Engine Failed" className="mt-12 rounded-2xl">
      We encountered an error while processing the complex analysis for this symbol. 
      Please check that all data points are available and try re-analyzing.
    </Banner>
  );
}