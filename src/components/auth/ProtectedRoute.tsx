import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedUserType: "user" | "artist";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserType }) => {
  const { isLoggedIn, userType } = useAuth();

  if (!isLoggedIn || userType !== allowedUserType) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
