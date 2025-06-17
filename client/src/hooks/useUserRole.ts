import { useQuery } from "@tanstack/react-query";
import { useKeycloakContext } from "../services/useKeycloakContext";
import coachesService from "../services/coachesService";
import clientsService from "../services/clientsService";

export const useUserRole = () => {
  const { keycloak } = useKeycloakContext();
  const userId = keycloak?.tokenParsed?.sub;
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];

  const isCoach = roles.includes("COACH");
  const isClient = roles.includes("CLIENT");

  // Hook pour les données du coach
  const coachQuery = useQuery({
    queryKey: ["coach-id", userId],
    queryFn: async () => {
      const result = await coachesService.getCoachIdByUserId(userId!);
      return result;
    },
    enabled: !!userId && !!keycloak?.authenticated && isCoach,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Hook pour les données du client
  const clientQuery = useQuery({
    queryKey: ["client-id", userId],
    queryFn: async () => {
      const result = await clientsService.getClientIdByUserId(userId!);
      return result;
    },
    enabled: !!userId && !!keycloak?.authenticated && isClient,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Logique pour déterminer l'accès
  let hasActiveSubscription = false;
  let subscriptionStatus = "free";
  let userId_entity = null;

  if (isCoach && coachQuery.data) {
    // Pour les coachs, vérifier le statut d'abonnement
    subscriptionStatus = coachQuery.data.subscription_status || "free";
    hasActiveSubscription = subscriptionStatus === "active";
    userId_entity = coachQuery.data.coach_id;
  } else if (isClient && clientQuery.data) {
    // Pour les clients, accès gratuit
    subscriptionStatus = "active"; // Les clients ont toujours accès
    hasActiveSubscription = true;
    userId_entity = clientQuery.data.client_id;
  }

  const isLoading = isCoach
    ? coachQuery.isLoading
    : isClient
    ? clientQuery.isLoading
    : false;
  const error = isCoach
    ? coachQuery.error
    : isClient
    ? clientQuery.error
    : null;
  const isError = isCoach
    ? coachQuery.isError
    : isClient
    ? clientQuery.isError
    : false;

  const refetch = () => {
    if (isCoach) {
      coachQuery.refetch();
    } else if (isClient) {
      clientQuery.refetch();
    }
  };

  return {
    // Informations de rôle
    isCoach,
    isClient,
    userRole: isCoach ? "COACH" : isClient ? "CLIENT" : null,

    // ID de l'entité (coach_id ou client_id)
    userId_entity,

    // Statut d'abonnement
    subscriptionStatus,
    hasActiveSubscription,

    // États de chargement
    isLoading,
    error,
    isError,
    isAuthenticated: !!keycloak?.authenticated,
    refetch,

    // Backward compatibility avec useCoachId
    coachId: isCoach ? userId_entity : null,
  };
};
