import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlinkAuth } from '@blinkdotnew/react';
import { Page, PageHeader, PageTitle, PageDescription, PageBody, DataTable, Button, Badge, EmptyState, toast, Persona, Card, CardHeader, CardContent } from '@blinkdotnew/ui';
import { Star, Trash2, ArrowUpRight, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { blink } from '../blink/client';

export default function WatchlistPage() {
  const { user, isAuthenticated } = useBlinkAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await blink.db.watchlist.list({
        where: { user_id: user.id }
      });
    },
    enabled: !!user
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (id: string) => {
      await blink.db.watchlist.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] });
      toast.success('Removed from watchlist');
    }
  });

  if (!isAuthenticated) {
    return (
      <Page className="max-w-4xl mx-auto py-24">
        <EmptyState 
          icon={<Star />}
          title="Sign in to view your watchlist"
          description="Keep track of your favorite symbols and see their real-time grades across sessions."
          action={{ label: 'Sign In', onClick: () => blink.auth.login() }}
        />
      </Page>
    );
  }

  const columns = [
    { 
      accessorKey: 'ticker', 
      header: 'Symbol', 
      cell: ({ row }: any) => (
        <Badge variant="outline" className="text-sm font-black px-4 py-1 border-primary/30 text-primary uppercase">
          {row.original.ticker}
        </Badge>
      ) 
    },
    { 
      accessorKey: 'created_at', 
      header: 'Added On', 
      cell: ({ row }: any) => new Date(row.original.created_at).toLocaleDateString() 
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate({ to: '/analysis/$ticker', params: { ticker: row.original.ticker } })}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" /> Analyze
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-600"
            onClick={() => removeFromWatchlist.mutate(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Page className="max-w-5xl mx-auto py-12 px-6">
      <PageHeader className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-6 h-6 text-primary fill-primary" />
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Personal Watchlist</span>
        </div>
        <PageTitle className="text-4xl font-black">Track Your Portfolio</PageTitle>
        <PageDescription className="text-lg">
          Monitor grades, verdicts, and performance of symbols you follow.
        </PageDescription>
      </PageHeader>
      
      <PageBody>
        {watchlist?.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-md">
            <CardContent className="py-16 text-center">
              <Star className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Watchlist Empty</h3>
              <p className="text-muted-foreground mb-8">You haven't added any symbols yet. Search for a stock to start analyzing.</p>
              <Button onClick={() => navigate({ to: '/' })} className="rounded-xl px-8">
                <Search className="w-4 h-4 mr-2" /> Start Searching
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="border border-border/50 rounded-2xl overflow-hidden bg-card/50 backdrop-blur-md shadow-2xl">
            <DataTable columns={columns} data={watchlist || []} loading={isLoading} />
          </div>
        )}
      </PageBody>
    </Page>
  );
}
