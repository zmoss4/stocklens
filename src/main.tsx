import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui';
import { BlinkAuthProvider } from '@blinkdotnew/react';
import { blink } from './blink/client';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkUIProvider theme="midnight" darkMode="system">
        <BlinkAuthProvider client={blink}>
          <Toaster position="top-right" />
          <App />
        </BlinkAuthProvider>
      </BlinkUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
