import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedUserType: "user" | "artist";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserType }) => {
  const { isLoggedIn, userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  // admin can access any dashboard
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (userType !== allowedUserType && userType !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
