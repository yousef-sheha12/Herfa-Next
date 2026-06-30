"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

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
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1E293B",
                  color: "#fff",
                  borderRadius: "12px",
                },
              }}
            />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
