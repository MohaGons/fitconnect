import { useQuery } from "@tanstack/react-query";
import { useKeycloakContext } from "../services/useKeycloakContext";
import coachesService from "../services/coachesService";

export const useCoachId = () => {
  const { keycloak } = useKeycloakContext();
  const userId = keycloak?.tokenParsed?.sub;

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["coach-id", userId],
    queryFn: async () => {
      try {
        const result = await coachesService.getCoachIdByUserId(userId!);
        return result;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!userId && !!keycloak?.authenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes - les données du coach changent rarement
    retry: 1, // Réessayer une fois en cas d'échec
  });

  // Retourner le coach_id ou 1 comme fallback
  const coachId = data?.coach_id || 1;

  return {
    coachId,
    isLoading,
    error,
    isError,
    isAuthenticated: !!keycloak?.authenticated,
  };
};
