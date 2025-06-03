import apiClient from "../../../api/axios";
import {
  Program,
  ProgramCreate,
  ProgramFilters,
  ProgramUpdate,
  PaginatedResponse,
  ProgramDuplicateRequest,
} from "../types";

const buildQueryParams = (filters: ProgramFilters): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.coach_id) params.append("coach_id", filters.coach_id.toString());
  if (filters.category) params.append("category", filters.category);
  if (filters.difficulty_level)
    params.append("difficulty_level", filters.difficulty_level);
  if (filters.search) params.append("search", filters.search);

  return params;
};

export const programsService = {
  // Récupérer les programmes avec pagination et filtrage
  getPrograms: async (
    filters: ProgramFilters
  ): Promise<PaginatedResponse<Program>> => {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<PaginatedResponse<Program>>(
      `/programs?${params}`
    );
    return response.data;
  },

  // Récupérer un programme par son ID
  getProgramById: async (id: number): Promise<Program> => {
    const response = await apiClient.get<Program>(`/programs/${id}`);
    return response.data;
  },

  // Récupérer les programmes d'un coach spécifique
  getProgramsByCoach: async (
    coachId: number,
    filters?: Partial<ProgramFilters>
  ): Promise<PaginatedResponse<Program>> => {
    const params = buildQueryParams({
      page: 1,
      limit: 10,
      ...filters,
      coach_id: coachId,
    });
    const response = await apiClient.get<PaginatedResponse<Program>>(
      `/programs/coach/${coachId}?${params}`
    );
    return response.data;
  },

  // Créer un nouveau programme
  createProgram: async (program: ProgramCreate): Promise<Program> => {
    const response = await apiClient.post<Program>("/programs", program);
    return response.data;
  },

  // Mettre à jour un programme existant
  updateProgram: async (
    id: number,
    program: ProgramUpdate
  ): Promise<Program> => {
    const response = await apiClient.patch<Program>(`/programs/${id}`, program);
    return response.data;
  },

  // Supprimer un programme
  deleteProgram: async (id: number): Promise<void> => {
    await apiClient.delete(`/programs/${id}`);
  },

  // Dupliquer un programme
  duplicateProgram: async (
    id: number,
    duplicateData: ProgramDuplicateRequest
  ): Promise<Program> => {
    const response = await apiClient.post<Program>(
      `/programs/${id}/duplicate`,
      duplicateData
    );
    return response.data;
  },
};

export default programsService;
