import apiClient from "../../../api/axios";
import { NutritionPlan, NutritionPlanCreate, NutritionPlanFilters, NutritionPlanUpdate, PaginatedResponse } from "../types";

const buildQueryParams = (filters: NutritionPlanFilters): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.goal) params.append('goal', filters.goal);
  if (filters.coach_id) params.append('coach_id', filters.coach_id.toString());
  if (filters.client_id) params.append('client_id', filters.client_id.toString());
  if (filters.search) params.append('search', filters.search);
  
  return params;
};

export const nutritionService = {
  // Récupérer les plans nutritionnels avec pagination et filtrage
  getNutritionPlans: async (filters: NutritionPlanFilters): Promise<PaginatedResponse<NutritionPlan>> => {
    const params = buildQueryParams(filters);
    console.log('[DEBUG FRONT] URL API nutrition-plans :', `/nutrition-plans?${params}`);
    const response = await apiClient.get<PaginatedResponse<NutritionPlan>>(`/nutrition-plans?${params}`);
    return response.data;
  },

  // Récupérer un plan nutritionnel par son ID
  getNutritionPlanById: async (id: number): Promise<NutritionPlan> => {
    const response = await apiClient.get<NutritionPlan>(`/nutrition-plans/${id}`);
    return response.data;
  },

  // Créer un nouveau plan nutritionnel
  createNutritionPlan: async (plan: NutritionPlanCreate): Promise<NutritionPlan> => {
    const response = await apiClient.post<NutritionPlan>('/nutrition-plans', plan);
    return response.data;
  },

  // Mettre à jour un plan nutritionnel existant
  updateNutritionPlan: async (id: number, plan: NutritionPlanUpdate): Promise<NutritionPlan> => {
    const response = await apiClient.patch<NutritionPlan>(`/nutrition-plans/${id}`, plan);
    return response.data;
  },

  // Supprimer un plan nutritionnel
  deleteNutritionPlan: async (id: number): Promise<void> => {
    await apiClient.delete(`/nutrition-plans/${id}`);
  },

  // Récupérer les clients d'un coach
  getCoachClients: async (coachId: number): Promise<Array<{
    client_id: number;
    user_id: string;
    firstName?: string;
    lastName?: string;
  }>> => {
    const response = await apiClient.get(`/calendar-events/coach/${coachId}/clients`);
    return response.data;
  }
};

export default nutritionService; 