import apiClient from "../api/axios";

export interface ClientIdResponse {
  client_id: number;
}

export const clientsService = {
  // Récupérer le client_id à partir de l'UUID Keycloak
  getClientIdByUserId: async (userId: string): Promise<ClientIdResponse> => {
    const response = await apiClient.get<ClientIdResponse>(
      `/clients/by-user-id/${userId}`
    );
    return response.data;
  },
};

export default clientsService;
