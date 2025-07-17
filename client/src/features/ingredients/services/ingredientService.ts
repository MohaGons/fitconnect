import apiClient from "../../../api/axios";
import { FoodItem, FoodItemCreate, FoodItemUpdate, FoodItemFilters, PaginatedResponse } from "../types";

const buildQueryParams = (filters: FoodItemFilters): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  
  return params;
};

export const ingredientService = {
  // Récupérer tous les ingrédients avec recherche optionnelle
  getFoodItems: async (search?: string): Promise<FoodItem[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await apiClient.get<FoodItem[]>(`/food-items${params}`);
    return response.data;
  },

  // Récupérer les ingrédients avec pagination et filtrage (nouvelle méthode)
  getFoodItemsPaginated: async (filters: FoodItemFilters): Promise<PaginatedResponse<FoodItem>> => {
    const params = buildQueryParams(filters);
    console.log('[DEBUG FRONT] URL API food-items :', `/food-items?${params}`);
    const response = await apiClient.get<PaginatedResponse<FoodItem>>(`/food-items?${params}`);
    return response.data;
  },

  // Récupérer un ingrédient par son ID
  getFoodItemById: async (id: number): Promise<FoodItem> => {
    const response = await apiClient.get<FoodItem>(`/food-items/${id}`);
    return response.data;
  },

  // Récupérer les ingrédients par catégorie
  getFoodItemsByCategory: async (category: string): Promise<FoodItem[]> => {
    const response = await apiClient.get<FoodItem[]>(`/food-items/category/${category}`);
    return response.data;
  },

  // Créer un nouvel ingrédient
  createFoodItem: async (foodItem: FoodItemCreate): Promise<FoodItem> => {
    const response = await apiClient.post<FoodItem>('/food-items', foodItem);
    return response.data;
  },

  // Mettre à jour un ingrédient
  updateFoodItem: async (id: number, foodItem: FoodItemUpdate): Promise<FoodItem> => {
    const response = await apiClient.patch<FoodItem>(`/food-items/${id}`, foodItem);
    return response.data;
  },

  // Supprimer un ingrédient
  deleteFoodItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/food-items/${id}`);
  }
};

export default ingredientService; 