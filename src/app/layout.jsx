"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useApi";
import { ToastProvider } from "@/hooks/useToast";
import ErrorBoundary from "@/components/ErrorBoundary";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 2 * 60 * 1000,
    },
  },
});
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="herfa">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Herfa - Find Your Perfect Artisan</title>
        <meta
          name="description"
          content="Connect with skilled artisans for all your home service needs."
        />
      </head>
      <body>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ToastProvider>
                <Navbar />
                <ErrorBoundary>{children}</ErrorBoundary>
              </ToastProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
