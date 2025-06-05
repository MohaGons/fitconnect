import apiClient from "../api/axios";

export interface CoachIdResponse {
  coach_id: number;
}

export const coachesService = {
  // Récupérer le coach_id à partir de l'UUID Keycloak
  getCoachIdByUserId: async (userId: string): Promise<CoachIdResponse> => {
    const response = await apiClient.get<CoachIdResponse>(
      `/coaches/by-user-id/${userId}`
    );
    return response.data;
  },
};

export default coachesService;
