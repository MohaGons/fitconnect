export type NutritionGoal = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'maintenance'
  | 'performance';

export interface NutritionPlan {
  plan_id: number;
  coach_id: number;
  client_id: number;
  name: string | null;
  creation_date: string;
  daily_calories: number | null;
  goal: NutritionGoal | null;
  comments: string | null;
  created_at: string;
  updated_at: string;
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
  meals?: Meal[];
}

export interface Meal {
  meal_id: number;
  plan_id: number;
  name: string;
  meal_type: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface NutritionPlanCreate {
  coach_id: number;
  client_id: number;
  name?: string;
  daily_calories?: number;
  goal?: NutritionGoal;
  comments?: string;
}

export interface NutritionPlanUpdate extends Partial<NutritionPlanCreate> {
  updated_at: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  goal?: NutritionGoal;
  search?: string;
  coach_id?: number;
  client_id?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface NutritionPlanFilters extends PaginationParams, FilterParams {}

export const NutritionGoalLabels: Record<NutritionGoal, string> = {
  weight_loss: 'Perte de poids',
  muscle_gain: 'Prise de muscle',
  maintenance: 'Maintien',
  performance: 'Performance',
};

export const NUTRITION_GOAL_OPTIONS = Object.entries(NutritionGoalLabels).map(
  ([value, label]) => ({ value, label })
); 