import apiClient from "../../../api/axios";
import { 
  Meal, 
  MealCreate, 
  MealFilters, 
  MealUpdate, 
  PaginatedResponse, 
  FoodItem, 
  FoodItemCreate, 
  MealFood, 
  MealFoodCreate 
} from "../types";

const buildQueryParams = (filters: MealFilters): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.meal_type) params.append('meal_type', filters.meal_type);
  if (filters.plan_id) params.append('plan_id', filters.plan_id.toString());
  if (filters.search) params.append('search', filters.search);
  
  return params;
};

export const mealService = {
  // ========== REPAS ==========
  
  // Récupérer les repas avec pagination et filtrage
  getMeals: async (filters: MealFilters): Promise<PaginatedResponse<Meal>> => {
    const params = buildQueryParams(filters);
    console.log('[DEBUG FRONT] URL API meals :', `/meals?${params}`);
    const response = await apiClient.get<PaginatedResponse<Meal>>(`/meals?${params}`);
    return response.data;
  },

  // Récupérer un repas par son ID
  getMealById: async (id: number): Promise<Meal> => {
    const response = await apiClient.get<Meal>(`/meals/${id}`);
    return response.data;
  },

  // Récupérer les repas d'un plan nutritionnel
  getMealsByPlanId: async (planId: number): Promise<Meal[]> => {
    const response = await apiClient.get<Meal[]>(`/meals/by-plan/${planId}`);
    return response.data;
  },

  // Créer un nouveau repas
  createMeal: async (meal: MealCreate): Promise<Meal> => {
    const response = await apiClient.post<Meal>('/meals', meal);
    return response.data;
  },

  // Mettre à jour un repas existant
  updateMeal: async (id: number, meal: MealUpdate): Promise<Meal> => {
    const response = await apiClient.patch<Meal>(`/meals/${id}`, meal);
    return response.data;
  },

  // Supprimer un repas
  deleteMeal: async (id: number): Promise<void> => {
    await apiClient.delete(`/meals/${id}`);
  },

  // ========== ALIMENTS ==========
  
  // Récupérer tous les aliments avec recherche optionnelle
  getFoodItems: async (search?: string): Promise<FoodItem[]> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await apiClient.get<{data: FoodItem[], total: number, page: number, limit: number}>(`/food-items${params}`);
    return response.data.data; // Extraire le tableau depuis la propriété 'data'
  },

  // Récupérer un aliment par son ID
  getFoodItemById: async (id: number): Promise<FoodItem> => {
    const response = await apiClient.get<FoodItem>(`/food-items/${id}`);
    return response.data;
  },

  // Récupérer les aliments par catégorie
  getFoodItemsByCategory: async (category: string): Promise<FoodItem[]> => {
    const response = await apiClient.get<FoodItem[]>(`/food-items/category/${category}`);
    return response.data;
  },

  // Créer un nouvel aliment
  createFoodItem: async (foodItem: FoodItemCreate): Promise<FoodItem> => {
    const response = await apiClient.post<FoodItem>('/food-items', foodItem);
    return response.data;
  },

  // Mettre à jour un aliment
  updateFoodItem: async (id: number, foodItem: Partial<FoodItemCreate>): Promise<FoodItem> => {
    const response = await apiClient.patch<FoodItem>(`/food-items/${id}`, foodItem);
    return response.data;
  },

  // Supprimer un aliment
  deleteFoodItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/food-items/${id}`);
  },

  // ========== INGRÉDIENTS DE REPAS ==========
  
  // Récupérer les ingrédients d'un repas
  getMealFoods: async (mealId: number): Promise<MealFood[]> => {
    const response = await apiClient.get<MealFood[]>(`/meal-foods/meal/${mealId}`);
    return response.data;
  },

  // Ajouter un ingrédient à un repas
  addMealFood: async (mealFood: MealFoodCreate): Promise<MealFood> => {
    const response = await apiClient.post<MealFood>('/meal-foods', mealFood);
    return response.data;
  },

  // Mettre à jour un ingrédient d'un repas
  updateMealFood: async (id: number, updates: Partial<MealFoodCreate>): Promise<MealFood> => {
    const response = await apiClient.patch<MealFood>(`/meal-foods/${id}`, updates);
    return response.data;
  },

  // Supprimer un ingrédient d'un repas
  deleteMealFood: async (id: number): Promise<void> => {
    await apiClient.delete(`/meal-foods/${id}`);
  },

  // Supprimer tous les ingrédients d'un repas
  deleteMealFoodsByMealId: async (mealId: number): Promise<void> => {
    await apiClient.delete(`/meal-foods/meal/${mealId}`);
  }
};

export default mealService; 