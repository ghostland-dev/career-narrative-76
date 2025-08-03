import React, { Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingScreen from "@/components/LoadingScreen";
import NotificationManager from "@/components/NotificationManager";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CVBuilder from "./pages/CVBuilder";
import Templates from "./pages/Templates";
import CVPreview from "./pages/CVPreview";
import Profile from "./pages/Profile";
import Support from "./pages/Support";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

const App = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingScreen message="Chargement de l'application..." />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={
                  <ErrorBoundary fallback={<LoadingScreen message="Erreur de chargement" variant="inline" />}>
                    <Auth />
                  </ErrorBoundary>
                } />
                <Route path="/dashboard" element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                } />
                <Route path="/templates" element={
                  <ErrorBoundary>
                    <Templates />
                  </ErrorBoundary>
                } />
                <Route path="/cv-builder" element={
                  <ErrorBoundary>
                    <CVBuilder />
                  </ErrorBoundary>
                } />
                <Route path="/cv-builder/:id" element={
                  <ErrorBoundary>
                    <CVBuilder />
                  </ErrorBoundary>
                } />
                <Route path="/cv-preview/:id" element={
                  <ErrorBoundary>
                    <CVPreview />
                  </ErrorBoundary>
                } />
                <Route path="/profile" element={
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                } />
                <Route path="/support" element={
                  <ErrorBoundary>
                    <Support />
                  </ErrorBoundary>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          
          <NotificationManager 
            notifications={notifications} 
            onRemove={removeNotification} 
          />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
