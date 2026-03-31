import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Page, PageHeader, PageTitle, PageDescription, PageBody, DataTable, Badge, Button, EmptyState, Card, CardHeader, CardContent, Stat, StatGroup, Banner } from '@blinkdotnew/ui';
import { History, TrendingUp, TrendingDown, ArrowLeft, ArrowUpRight, Search, FileText, Share2, Printer, Target, Sparkles } from 'lucide-react';
import { blink } from '../blink/client';

export default function ReportPage() {
  const { id } = useParams({ from: '/report/$id' });
  const navigate = useNavigate();

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      const res = await blink.db.reports.get(id);
      return res || null;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <Page className="max-w-4xl mx-auto py-24 px-6 text-center">
        <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-3xl">
          <FileText className="w-16 h-16 text-destructive/40 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Report Unavailable</h2>
          <p className="text-muted-foreground mb-12">The analysis report you're looking for couldn't be found or is no longer accessible.</p>
          <Button onClick={() => navigate({ to: '/' })} className="rounded-xl px-8 bg-primary">
            <Search className="w-4 h-4 mr-2" /> Start New Search
          </Button>
        </div>
      </Page>
    );
  }

  const analysis = JSON.parse(report.data);

  return (
    <Page className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Shareable AI Analysis Report</span>
          </div>
          <PageTitle className="text-4xl font-black mb-1">StockLens: {report.ticker} Intelligence</PageTitle>
          <PageDescription className="text-lg">Generated on {new Date(report.created_at).toLocaleDateString()}</PageDescription>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" className="rounded-xl font-bold" onClick={() => window.print()}>
            <Printer className="w-5 h-5 mr-2" /> Print PDF
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl font-bold" onClick={() => navigate({ to: '/' })}>
             Back to Search
          </Button>
        </div>
      </div>

      <PageBody className="space-y-12">
        <Banner variant="info" title="Read-Only Report" className="rounded-2xl">
          This is a snapshot of the live intelligence for {report.ticker}. For up-to-the-minute data, start a new analysis.
        </Banner>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 border-primary/20 bg-primary/5 backdrop-blur-xl p-8 rounded-3xl text-center shadow-2xl">
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Overall Grade</div>
            <div className="text-[120px] font-black leading-none mb-4 text-primary">
              {analysis.grade}
            </div>
            <Badge variant="outline" className="text-xl font-black px-8 py-2 rounded-full border-2 border-primary/20 bg-primary/5 text-primary uppercase">
              {analysis.verdict}
            </Badge>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/50 bg-card/50 shadow-xl p-8 rounded-3xl">
              <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" /> Analyst Executive Take
              </h3>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                "{analysis.analystTake}"
              </p>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="border-border/50 bg-card/50 shadow-xl p-8 rounded-3xl">
              <div className="flex items-center gap-2 text-green-500 font-black text-sm uppercase tracking-widest mb-6">
                <TrendingUp className="w-5 h-5" /> 3-Point Bull Case
              </div>
              <ul className="space-y-4">
                {analysis.bullCase?.map((b: string, i: number) => (
                  <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="text-green-500 font-bold">•</span> {b}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="border-border/50 bg-card/50 shadow-xl p-8 rounded-3xl">
              <div className="flex items-center gap-2 text-red-500 font-black text-sm uppercase tracking-widest mb-6">
                <TrendingDown className="w-5 h-5" /> 3-Point Bear Case
              </div>
              <ul className="space-y-4">
                {analysis.bearCase?.map((b: string, i: number) => (
                  <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="text-red-500 font-bold">•</span> {b}
                  </li>
                ))}
              </ul>
            </Card>
        </div>

        <footer className="mt-24 text-center text-xs text-muted-foreground/40 border-t border-border/50 pt-8 pb-12">
          <p className="mb-4">StockLens is for educational and informational purposes only. Nothing on this platform constitutes financial advice.</p>
          <div className="flex justify-center gap-8 font-bold text-muted-foreground/20">
            <span>REUTERS</span>
            <span>BLOOMBERG</span>
            <span>WSJ</span>
            <span>CNBC</span>
          </div>
        </footer>
      </PageBody>
    </Page>
  );
}
