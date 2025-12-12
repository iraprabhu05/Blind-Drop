
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Listen from "./pages/Listen";
import Reveal from "./pages/Reveal";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./pages/auth/Auth";
import UserDashboard from "./pages/dashboards/UserDashboard";
import ArtistDashboard from "./components/dashboards/ArtistDashboard/ArtistDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RealityWrapped from "./pages/RealityWrapped";

const queryClient = new QueryClient();

const AppRoutes = () => {
    const { isLoggedIn, userType } = useAuth();

    return (
        <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to={`/dashboard/${userType}`} /> : <Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/listen" element={<Listen />} />
            <Route path="/reveal" element={<Reveal />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reality-wrapped" element={<RealityWrapped />} />
            <Route element={<ProtectedRoute allowedUserType='user' />}>
                <Route path="/dashboard/user" element={<UserDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedUserType='artist' />}>
                <Route path="/dashboard/artist/*" element={<ArtistDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
        </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
