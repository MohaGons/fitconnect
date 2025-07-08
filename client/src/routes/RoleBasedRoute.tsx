import React from "react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireSubscription?: boolean;
  fallbackPath?: string;
  showAccessDenied?: boolean;
}


const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
  </div>
);

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireSubscription = false,
}) => {
  const { 
    userRole, 
    isLoading, 
    hasActiveSubscription, 
    isCoach,
    isAuthenticated 
  } = useUserRole();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasValidRole = allowedRoles.length === 0 || (userRole !== null && allowedRoles.includes(userRole));
  
  if (!hasValidRole) {
    return <Navigate to="*" replace />;
  }

  if (requireSubscription && isCoach && !hasActiveSubscription) {
    return <Navigate to="*" replace />;
  }  return <>{children}</>;
};

export default RoleBasedRoute;