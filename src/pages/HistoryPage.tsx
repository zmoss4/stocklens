import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Page, PageHeader, PageTitle, PageDescription, PageBody, DataTable, Badge, Button, EmptyState, Card, CardHeader, CardContent, Stat, StatGroup } from '@blinkdotnew/ui';
import { History, TrendingUp, TrendingDown, ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { blink } from '../blink/client';

export default function HistoryPage() {
  const { ticker } = useParams({ from: '/history/$ticker' });
  const navigate = useNavigate();

  const { data: history, isLoading } = useQuery({
    queryKey: ['history', ticker],
    queryFn: async () => {
      const res = await blink.db.historical_grades.list({
        where: { ticker: ticker },
        orderBy: { analysis_date: 'desc' }
      });
      return res || [];
    }
  });

  const columns = [
    { 
      accessorKey: 'analysis_date', 
      header: 'Date', 
      cell: ({ row }: any) => new Date(row.original.analysis_date).toLocaleDateString() 
    },
    { 
      accessorKey: 'grade', 
      header: 'Grade', 
      cell: ({ row }: any) => (
        <Badge variant="outline" className={`text-xl font-black px-4 py-1 border-primary/30 text-primary uppercase`}>
          {row.original.grade}
        </Badge>
      ) 
    },
    { 
      accessorKey: 'verdict', 
      header: 'Verdict', 
      cell: ({ row }: any) => (
        <Badge variant="secondary" className="font-bold text-xs uppercase tracking-widest">{row.original.verdict}</Badge>
      ) 
    },
    { 
      accessorKey: 'confidence_score', 
      header: 'Confidence', 
      cell: ({ row }: any) => `${row.original.confidence_score}%` 
    }
  ];

  return (
    <Page className="max-w-5xl mx-auto py-12 px-6">
      <PageHeader className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/analysis/$ticker', params: { ticker } })}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-widest">Historical Performance Tracking</span>
          </div>
        </div>
        <PageTitle className="text-4xl font-black">Performance Record: {ticker}</PageTitle>
        <PageDescription className="text-lg">
          StockLens tracks proprietary grade history over market cycles, showing how AI and analysts trends evolve.
        </PageDescription>
      </PageHeader>
      
      <PageBody>
        {history?.length === 0 ? (
          <EmptyState 
            icon={<History />}
            title="No historical grades yet"
            description="We haven't tracked any previous grades for this symbol. Be the first to generate a report."
            action={{ label: 'Generate Analysis', onClick: () => navigate({ to: '/analysis/$ticker', params: { ticker } }) }}
          />
        ) : (
          <div className="space-y-8">
            <StatGroup className="grid-cols-2 md:grid-cols-3 gap-6">
              <Stat label="Average Grade" value="B+" />
              <Stat label="Total Analyses" value={history?.length || 0} />
              <Stat label="Trend" value="Improving" trend={+12.5} />
            </StatGroup>

            <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/50 backdrop-blur-md shadow-2xl">
              <DataTable columns={columns} data={history || []} loading={isLoading} />
            </div>
          </div>
        )}
      </PageBody>
    </Page>
  );
}
