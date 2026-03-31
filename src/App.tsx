import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { useBlinkAuth } from '@blinkdotnew/react';
import { Page, Sidebar, AppShell, AppShellSidebar, AppShellMain, SidebarHeader, SidebarContent, SidebarGroup, SidebarItem, MobileSidebarTrigger, Button } from '@blinkdotnew/ui';
import { LayoutDashboard, Star, History, Search, LogIn, LogOut, TrendingUp } from 'lucide-react';
import { blink } from './blink/client';
import React, { useState } from 'react';

// Pages (to be implemented)
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import WatchlistPage from './pages/WatchlistPage';
import HistoryPage from './pages/HistoryPage';
import ReportPage from './pages/ReportPage';

const rootRoute = createRootRoute({
  component: () => {
    const { user, isAuthenticated, isLoading } = useBlinkAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    return (
      <AppShell>
        <AppShellSidebar>
          <Sidebar>
            <SidebarHeader className="border-b border-border/50">
              <div className="flex items-center gap-2 px-2 h-14">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl tracking-tight">StockLens</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarItem icon={<Search />} label="Analysis" href="/" active />
                <SidebarItem icon={<Star />} label="Watchlist" href="/watchlist" />
                <SidebarItem icon={<History />} label="Grade History" href="/history" />
              </SidebarGroup>
            </SidebarContent>
            <div className="mt-auto p-4 border-t border-border/50">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium px-2 truncate">{user?.email}</div>
                  <Button variant="ghost" size="sm" onClick={() => blink.auth.logout()} className="justify-start">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={() => blink.auth.login()} className="w-full">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </Button>
              )}
            </div>
          </Sidebar>
        </AppShellSidebar>
        <AppShellMain>
          <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <MobileSidebarTrigger />
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-bold">StockLens</span>
            </div>
          </div>
          <Outlet />
        </AppShellMain>
      </AppShell>
    );
  },
});

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const analysisRoute = createRoute({ getParentRoute: () => rootRoute, path: '/analysis/$ticker', component: AnalysisPage });
const watchlistRoute = createRoute({ getParentRoute: () => rootRoute, path: '/watchlist', component: WatchlistPage });
const historyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/history/$ticker', component: HistoryPage });
const reportRoute = createRoute({ getParentRoute: () => rootRoute, path: '/report/$id', component: ReportPage });

const routeTree = rootRoute.addChildren([indexRoute, analysisRoute, watchlistRoute, historyRoute, reportRoute]);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

export default function App() {
  return <RouterProvider router={router} />;
}
