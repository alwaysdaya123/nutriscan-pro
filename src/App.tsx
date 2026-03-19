import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { GlobalErrorBoundary } from "@/components/errors/GlobalErrorBoundary";
import { ThemeProvider } from "next-themes";
import LandingPage from "./pages/LandingPage";
import AnalyzePage from "./pages/AnalyzePage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import MealsPage from "./pages/MealsPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import DietHistoryPage from "./pages/DietHistoryPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";


// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminFoodItemsPage from "./pages/admin/AdminFoodItemsPage";
import AdminSystemPage from "./pages/admin/AdminSystemPage";
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <GlobalErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AccessibilityProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/analyze" element={<AnalyzePage />} />
                  <Route path="/auth/signin" element={<AuthPage mode="signin" />} />
                  <Route path="/auth/signup" element={<AuthPage mode="signup" />} />
                  <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meals"
                    element={
                      <ProtectedRoute>
                        <MealsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/meal-planner"
                    element={
                      <ProtectedRoute>
                        <MealPlannerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/progress"
                    element={
                      <ProtectedRoute>
                        <ProgressPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/diet-history"
                    element={
                      <ProtectedRoute>
                        <DietHistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <AdminUsersPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/food-items"
                    element={
                      <AdminRoute>
                        <AdminFoodItemsPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/system"
                    element={
                      <AdminRoute>
                        <AdminSystemPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/audit-logs"
                    element={
                      <AdminRoute>
                        <AdminAuditLogsPage />
                      </AdminRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </HashRouter>
          </AccessibilityProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </GlobalErrorBoundary>
);

export default App;
