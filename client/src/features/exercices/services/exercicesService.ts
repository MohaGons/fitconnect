import apiClient from "../../../api/axios";
import { Exercise, ExerciseCreate, ExerciseFilters, ExerciseUpdate, PaginatedResponse } from "../types";
const buildQueryParams = (filters: ExerciseFilters): URLSearchParams => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.muscle_category) params.append('muscle_category', filters.muscle_category);
    if (filters.difficulty_level) params.append('difficulty_level', filters.difficulty_level);
    if (filters.search) params.append('search', filters.search);
    
    return params;
  };
export const exercicesService = {
    // Récupérer les exercices avec pagination et filtrage
    getExercises: async (filters: ExerciseFilters): Promise<PaginatedResponse<Exercise>> => {
      const params = buildQueryParams(filters);
      const response = await apiClient.get<PaginatedResponse<Exercise>>(`/exercises?${params}`);
      return response.data;
    },
  
    // Récupérer un exercice par son ID
    getExerciseById: async (id: number): Promise<Exercise> => {
      const response = await apiClient.get<Exercise>(`/exercises/${id}`);
      return response.data;
    },
  
    // Créer un nouvel exercice
    createExercise: async (exercise: ExerciseCreate): Promise<Exercise> => {
      const response = await apiClient.post<Exercise>('/exercises', exercise);
      return response.data;
    },
  
    // Mettre à jour un exercice existant
    updateExercise: async (id: number, exercise: ExerciseUpdate): Promise<Exercise> => {
      const response = await apiClient.patch<Exercise>(`/exercises/${id}`, exercise);
      return response.data;
    },
  
    // Supprimer un exercice
    deleteExercise: async (id: number): Promise<void> => {
      await apiClient.delete(`/exercises/${id}`);
    }
  };
  
  export default exercicesService;