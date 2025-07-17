export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "pre_workout"
  | "post_workout";

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

export interface MealFood {
  meal_food_id: number;
  meal_id: number;
  food_item_id: number;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
  food_item?: FoodItem;
}

export interface Meal {
  meal_id: number;
  plan_id: number | null;
  name: string;
  meal_type: MealType | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  instructions: string | null;
  created_at: string;
  updated_at: string;
  nutrition_plan?: {
    plan_id: number;
    name: string | null;
    coach?: {
      coach_id: number;
      first_name: string;
      last_name: string;
    };
    client?: {
      client_id: number;
      first_name: string;
      last_name: string;
    };
  };
  meal_foods?: MealFood[];
}

export interface MealCreate {
  plan_id: number | null;
  name: string;
  meal_type?: MealType;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  instructions?: string;
}

export interface MealUpdate extends Partial<MealCreate> {}

export interface FoodItemCreate {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category?: string;
}

export interface MealFoodCreate {
  meal_id: number;
  food_id: number;
  quantity: number;
  unit: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  plan_id?: number;
  meal_type?: MealType;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface MealFilters extends PaginationParams, FilterParams {}

export const MealTypeLabels: Record<MealType, string> = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
  snack: "Collation",
  pre_workout: "Pré-entraînement",
  post_workout: "Post-entraînement",
};

export const MEAL_TYPE_OPTIONS = Object.entries(MealTypeLabels).map(
  ([value, label]) => ({ value, label })
);

// Unités de mesure pour les aliments
export const FOOD_UNITS = [
  { value: "g", label: "grammes (g)" },
  { value: "kg", label: "kilogrammes (kg)" },
  { value: "ml", label: "millilitres (ml)" },
  { value: "l", label: "litres (l)" },
  { value: "cup", label: "tasse" },
  { value: "tbsp", label: "cuillère à soupe" },
  { value: "tsp", label: "cuillère à thé" },
  { value: "piece", label: "pièce(s)" },
  { value: "slice", label: "tranche(s)" },
  { value: "portion", label: "portion(s)" },
];
