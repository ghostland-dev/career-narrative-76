import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingScreen from "@/components/LoadingScreen";
import NotificationManager from "@/components/NotificationManager";
import UserActivityTracker from "@/components/analytics/UserActivityTracker";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages for better performance
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CVBuilder = lazy(() => import("./pages/CVBuilder"));
const Templates = lazy(() => import("./pages/Templates"));
const CVPreview = lazy(() => import("./pages/CVPreview"));
const Profile = lazy(() => import("./pages/Profile"));
const Support = lazy(() => import("./pages/Support"));
const Subscription = lazy(() => import("./pages/Subscription"));
const NewCV = lazy(() => import("./pages/NewCV"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
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
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
                <UserActivityTracker />
                <Suspense fallback={<LoadingScreen message="Chargement de l'application..." />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    
                    {/* Auth routes - redirect if already authenticated */}
                    <Route 
                      path="/auth" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <ErrorBoundary fallback={<LoadingScreen message="Erreur de chargement" variant="inline" />}>
                            <Auth />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Protected routes - require authentication */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Dashboard />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/templates" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Templates />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/cv-builder" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <NewCV />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/cv-builder/:id" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <CVBuilder />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/cv-preview/:id" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <CVPreview />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Profile />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/support" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Support />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/subscription" 
                      element={
                        <ProtectedRoute>
                          <ErrorBoundary>
                            <Subscription />
                          </ErrorBoundary>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Public CV routes */}
                    <Route path="/cv-public/:id" element={<CVPreview />} />
                    <Route path="/cv-embed/:id" element={<CVPreview />} />
                    
                    {/* Legal pages */}
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AuthProvider>
              
              
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;