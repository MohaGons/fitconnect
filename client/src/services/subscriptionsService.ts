import apiClient from "../api/axios";

// Types
export interface CreateCoachingRequestData {
  client_id: number;
  coach_id: number;
  message?: string;
  subscription_type?: string;
}

export interface UpdateSubscriptionStatusData {
  status: "active" | "rejected";
  start_date?: string;
  end_date?: string;
}

export interface Subscription {
  subscription_id: number;
  client_id: number;
  coach_id: number;
  start_date: string | null;
  end_date: string | null;
  status: "pending" | "active" | "rejected" | "expired";
  amount: number;
  subscription_type: string;
  created_at: string;
  updated_at: string;
  client?: {
    client_id: number;
    firstName: string;
    lastName: string;
    email: string;
    goal: string;
  };
  coach?: {
    coach_id: number;
    firstName: string;
    lastName: string;
    specialty: string;
  };
}

export const subscriptionsService = {
  // Créer une demande de coaching (client vers coach)
  createCoachingRequest: async (
    data: CreateCoachingRequestData
  ): Promise<Subscription> => {
    const response = await apiClient.post<Subscription>(
      "/subscriptions/coaching-request",
      data
    );
    return response.data;
  },

  // Accepter ou refuser une demande (coach)
  updateSubscriptionStatus: async (
    subscriptionId: number,
    data: UpdateSubscriptionStatusData
  ): Promise<Subscription> => {
    const response = await apiClient.patch<Subscription>(
      `/subscriptions/${subscriptionId}/status`,
      data
    );
    return response.data;
  },

  // Récupérer les demandes en attente pour un coach
  getPendingRequestsByCoach: async (
    coachId: number
  ): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>(
      `/subscriptions/coach/${coachId}/pending-requests`
    );
    return response.data;
  },

  // Récupérer les clients actifs pour un coach
  getActiveClientsByCoach: async (coachId: number): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>(
      `/subscriptions/coach/${coachId}/active-clients`
    );
    return response.data;
  },

  // Récupérer toutes les subscriptions d'un client
  getSubscriptionsByClient: async (
    clientId: number
  ): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>(
      `/subscriptions/client/${clientId}`
    );
    return response.data;
  },

  // Récupérer le coach actif d'un client
  getActiveCoachByClient: async (
    clientId: number
  ): Promise<Subscription | null> => {
    const response = await apiClient.get<Subscription | null>(
      `/subscriptions/client/${clientId}/active-coach`
    );
    return response.data;
  },

  // Récupérer toutes les demandes d'un client (pour vérifier les statuts)
  getClientRequests: async (clientId: number): Promise<Subscription[]> => {
    const response = await apiClient.get<Subscription[]>(
      `/subscriptions/client/${clientId}/requests`
    );
    return response.data;
  },
};

export default subscriptionsService;
