import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui';
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const projectId = import.meta.env.VITE_BLINK_PROJECT_ID;
const publishableKey = import.meta.env.VITE_BLINK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkUIProvider theme="midnight" darkMode="system">
        <BlinkProvider projectId={projectId} publishableKey={publishableKey}>
          <BlinkAuthProvider>
            <Toaster position="top-right" />
            <App />
          </BlinkAuthProvider>
        </BlinkProvider>
      </BlinkUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
