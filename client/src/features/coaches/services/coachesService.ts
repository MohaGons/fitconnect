import apiClient from "../../../api/axios";
import { Coach, CoachCreate, CoachUpdate, CoachFilters, PaginatedResponse } from "../types";

const buildQueryParams = (filters: CoachFilters): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.deleted !== undefined) params.append('deleted', filters.deleted.toString());
  
  return params;
};

export const coachesService = {
  // Récupérer tous les coachs avec recherche optionnelle
  getCoaches: async (search?: string): Promise<Coach[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await apiClient.get<Coach[]>(`/coaches${params}`);
    return response.data;
  },

  // Récupérer les coachs avec pagination et filtrage
  getCoachesPaginated: async (filters: CoachFilters): Promise<any> => {
    const params = buildQueryParams(filters);
    console.log('[DEBUG FRONT] URL API coaches :', `/coaches?${params}`);
    const response = await apiClient.get<PaginatedResponse<Coach>>(`/coaches?${params}`);
    return response.data;
  },

  // Récupérer un coach par son ID
  getCoachById: async (id: number): Promise<Coach> => {
    const response = await apiClient.get<Coach>(`/coaches/${id}`);
    return response.data;
  },

  // Récupérer un coach par son ID utilisateur Keycloak
  getCoachByUserId: async (userId: string): Promise<Coach> => {
    const response = await apiClient.get<Coach>(`/coaches/by-user-id/${userId}`);
    return response.data;
  },

  // Récupérer le profil complet d'un coach
  getCoachProfile: async (userId: string): Promise<Coach> => {
    const response = await apiClient.get<Coach>(`/coaches/profile/${userId}`);
    return response.data;
  },

  // Créer un nouveau coach
  createCoach: async (coach: CoachCreate): Promise<Coach> => {
    const response = await apiClient.post<Coach>('/coaches', coach);
    return response.data;
  },

  // Mettre à jour un coach
  updateCoach: async (id: number, coach: CoachUpdate): Promise<Coach> => {
    const response = await apiClient.patch<Coach>(`/coaches/${id}`, coach);
    return response.data;
  },

  // Supprimer un coach (logique, mettre deleted = true)
  deleteCoach: async (id: number): Promise<Coach> => {
    const response = await apiClient.patch<Coach>(`/coaches/${id}`, { deleted: true });
    return response.data;
  },

  // Réactiver un coach (mettre deleted = false)
  activateCoach: async (id: number): Promise<Coach> => {
    const response = await apiClient.patch<Coach>(`/coaches/${id}`, { deleted: false });
    return response.data;
  }
};

export default coachesService;