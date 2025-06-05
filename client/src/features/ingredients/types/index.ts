export interface FoodItem {
  food_id: number;
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoodItemCreate {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category?: string;
}

export interface FoodItemUpdate extends Partial<FoodItemCreate> {
  updated_at: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FoodItemFilters extends PaginationParams, FilterParams {}

// Catégories d'aliments courantes
export const FOOD_CATEGORIES = [
  { value: 'légumes', label: 'Légumes' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'céréales', label: 'Céréales' },
  { value: 'protéines', label: 'Protéines' },
  { value: 'produits-laitiers', label: 'Produits laitiers' },
  { value: 'matières-grasses', label: 'Matières grasses' },
  { value: 'épices', label: 'Épices et condiments' },
  { value: 'boissons', label: 'Boissons' },
  { value: 'autres', label: 'Autres' },
]; 