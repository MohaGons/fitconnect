import { useEffect, useState } from "react";
import { useKeycloakContext } from "../services/useKeycloakContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

const ProtectedRoute = () => {
  const { keycloak, initialized } = useKeycloakContext();
  const location = useLocation();
  const {
    isCoach,
    hasActiveSubscription,
    isLoading: isUserRoleLoading,
  } = useUserRole();

  const [checking, setChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) return;

    if (!keycloak?.authenticated) {
      setRedirectPath("/login");
      setChecking(false);
      return;
    }

    const roles = keycloak.tokenParsed?.realm_access?.roles || [];

    // Gestion spéciale pour les admins
    if (roles.includes("ADMIN")) {
      setRedirectPath("/admin-profile");
      setChecking(false);
      return;
    }

    // Si l'utilisateur n'a pas de rôle défini, le rediriger vers l'inscription
    if (!roles.includes("COACH") && !roles.includes("CLIENT")) {
      if (location.pathname !== "/inscription") {
        setRedirectPath("/inscription");
      } else {
        setRedirectPath(null); // évite la boucle
      }
      setChecking(false);
      return;
    }

    // Pour les coaches, vérifier le statut d'abonnement avant de rediriger
    if (roles.includes("COACH")) {
      // Attendre que les données du coach soient chargées
      if (isUserRoleLoading) {
        return; // Continue à attendre
      }

      // Si on est sur une page autorisée même sans abonnement, ne pas rediriger
      const allowedPathsWithoutSubscription = [
        "/dashboard/payment",
        "/dashboard/profile",
        "/inscription",
      ];

      if (allowedPathsWithoutSubscription.includes(location.pathname)) {
        setRedirectPath(null);
        setChecking(false);
        return;
      }

      // Redirection selon le statut d'abonnement
      if (!hasActiveSubscription) {
        // Coach sans abonnement actif → page de paiement
        setRedirectPath("/dashboard/payment");
      } else {
        // Coach avec abonnement actif → page des statistiques
        if (location.pathname === "/dashboard" || location.pathname === "/") {
          setRedirectPath("/dashboard/home");
        } else {
          setRedirectPath(null);
        }
      }
    } else {
      // Pour les clients, pas de redirection spéciale pour l'instant
      setRedirectPath(null);
    }

    setChecking(false);
  }, [
    initialized,
    keycloak?.authenticated,
    location.pathname,
    isCoach,
    hasActiveSubscription,
    isUserRoleLoading,
  ]);

  if (checking || !initialized || (isCoach && isUserRoleLoading)) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Chargement...
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
