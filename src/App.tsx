import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index"; // This now renders EfodeaLanding
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import IdentificationPage from "./pages/IdentificationPage";
import RespirationPage from "./pages/RespirationPage";
import NutritionPage from "./pages/NutritionPage";
import ConsciousnessPage from "./pages/ConsciousnessPage";
import CommunicationPage from "./pages/CommunicationPage";
import OrofacialEvaluationPage from "./pages/OrofacialEvaluationPage";
import DentitionPage from "./pages/DentitionPage"; // Import the new DentitionPage
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <IdentificationPage /> {/* The main protected route now shows IdentificationPage */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/respiration"
              element={
                <ProtectedRoute>
                  <RespirationPage /> {/* Protected route for RespirationPage */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute>
                  <NutritionPage /> {/* Protected route for NutritionPage */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/consciousness"
              element={
                <ProtectedRoute>
                  <ConsciousnessPage /> {/* Protected route for ConsciousnessPage */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/communication"
              element={
                <ProtectedRoute>
                  <CommunicationPage /> {/* Protected route for CommunicationPage */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/orofacial-evaluation"
              element={
                <ProtectedRoute>
                  <OrofacialEvaluationPage /> {/* Protected route for OrofacialEvaluationPage */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dentition"
              element={
                <ProtectedRoute>
                  <DentitionPage /> {/* New protected route for DentitionPage */}
                </ProtectedRoute>
              }
            />
            {/* Route for EfodeaLanding, accessible after login if desired, or as a public page */}
            <Route path="/efodea-landing" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;