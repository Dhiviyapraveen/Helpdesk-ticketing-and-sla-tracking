import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

import MainLayout from "@/layouts/MainLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import UserTickets from "@/pages/Tickets";
import AgentTickets from "@/pages/AgentTickets";
import AdminTickets from "@/pages/AdminTickets";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

/* Protected Route */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* Admin Only Route */
const AdminRoute = ({ children }: { children: JSX.Element }) => {

  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {

  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  const getHomeRoute = () => {

    if (!user) return "/login";

    if (user.role === "admin") return "/admin-dashboard";

    if (user.role === "agent") return "/agent-tickets";

    return "/dashboard";
  };

  return (
    <Routes>

      {/* Root */}
      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />

      {/* Login */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to={getHomeRoute()} replace />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to={getHomeRoute()} replace />}
      />

      {/* Protected Layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Tickets */}
        <Route path="/tickets" element={<UserTickets />} />

        {/* Agent Tickets */}
        <Route path="/agent-tickets" element={<AgentTickets />} />

        {/* Admin Tickets */}
        <Route
          path="/admin-tickets"
          element={
            <AdminRoute>
              <AdminTickets />
            </AdminRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Admin User Management */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>

    <TooltipProvider>

      <Toaster />

      <Sonner />

      <BrowserRouter>

        <AuthProvider>

          <AppRoutes />

        </AuthProvider>

      </BrowserRouter>

    </TooltipProvider>

  </QueryClientProvider>
);

export default App;