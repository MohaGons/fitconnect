export type MuscleCategory =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "core"
  | "full_body"
  | "cardio";

export type DifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface Exercise {
  exercise_id: number;
  name: string;
  description: string | null;
  muscle_category: MuscleCategory;
  difficulty_level: DifficultyLevel;
  image: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseCreate {
  name: string;
  description?: string;
  muscle_category: MuscleCategory;
  difficulty_level: DifficultyLevel;
  image?: string;
  video_url?: string;
}

export interface ExerciseUpdate extends Partial<ExerciseCreate> {}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  muscle_category?: MuscleCategory;
  difficulty_level?: DifficultyLevel;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ExerciseFilters extends PaginationParams, FilterParams {}

export const MuscleCategoryLabels: Record<MuscleCategory, string> = {
  chest: "Poitrine",
  back: "Dos",
  shoulders: "Épaules",
  arms: "Bras",
  legs: "Jambes",
  core: "Abdominaux",
  full_body: "Corps entier",
  cardio: "Cardio",
};

export const DifficultyLevelLabels: Record<DifficultyLevel, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  expert: "Expert",
};

export const MUSCLE_CATEGORY_OPTIONS = Object.entries(MuscleCategoryLabels).map(
  ([value, label]) => ({ value, label })
);

export const DIFFICULTY_LEVEL_OPTIONS = Object.entries(
  DifficultyLevelLabels
).map(([value, label]) => ({ value, label }));
