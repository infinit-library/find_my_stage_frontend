import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthRedirect from "@/components/AuthRedirect";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import ResultsPage from "./pages/ResultsPage";
import Subscribe from "./pages/Subscribe";
import SubscribeSuccess from "./pages/SubscribeSuccess";
import SubscribeCancel from "./pages/SubscribeCancel";
import FavoritesPage from "./pages/FavoritesPage";
import OAuthCallback from "./pages/OAuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={
                <AuthRedirect>
                  <AuthPage />
                </AuthRedirect>
              } />
              <Route path="/signup" element={
                <AuthRedirect>
                  <AuthPage />
                </AuthRedirect>
              } />
              <Route path="/login" element={
                <AuthRedirect>
                  <AuthPage />
                </AuthRedirect>
              } />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/subscribe/success" element={<SubscribeSuccess />} />
              <Route path="/subscribe/cancel" element={<SubscribeCancel />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
