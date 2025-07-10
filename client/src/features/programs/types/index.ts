export type DifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export type ProgramCategory =
  | "strength"
  | "cardio"
  | "flexibility"
  | "hiit"
  | "functional"
  | "rehabilitation";

export interface ProgramExercise {
  program_exercise_id: number;
  program_id: number;
  exercise_id: number;
  order_number: number;
  sets?: number;
  repetitions?: number;
  recommended_weight?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  instructions?: string;
  created_at: string;
  updated_at: string;
  exercise?: {
    exercise_id: number;
    name: string;
    description?: string;
    muscle_category: string;
    difficulty_level: string;
    image?: string;
    video_url?: string;
  };
}

export interface Program {
  program_id: number;
  coach_id: number;
  name: string;
  description?: string;
  difficulty_level: DifficultyLevel;
  category: ProgramCategory;
  creation_date: string;
  created_at: string;
  updated_at: string;
  coach?: {
    coach_id: number;
    user_id: number;
    bio?: string;
    specialization?: string;
    certification?: string;
    years_of_experience?: number;
  };
  program_exercises: ProgramExercise[];
}

export interface ProgramExerciseCreate {
  exercise_id: number;
  order_number: number;
  sets?: number;
  repetitions?: number;
  recommended_weight?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  instructions?: string;
}

export interface ProgramCreate {
  coach_id: number;
  name: string;
  description?: string;
  difficulty_level: DifficultyLevel;
  category: ProgramCategory;
  exercises: ProgramExerciseCreate[];
}

export interface ProgramUpdate {
  coach_id?: number;
  name?: string;
  description?: string;
  difficulty_level?: DifficultyLevel;
  category?: ProgramCategory;
  exercises?: {
    exercise_id: number;
    order_number: number;
    sets?: number;
    repetitions?: number;
    recommended_weight?: number;
    duration_seconds?: number;
    rest_seconds?: number;
    instructions?: string;
  }[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  coach_id?: number;
  category?: ProgramCategory;
  difficulty_level?: DifficultyLevel;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ProgramFilters extends PaginationParams, FilterParams {}

export const DifficultyLevelLabels: Record<DifficultyLevel, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  expert: "Expert",
};

export const ProgramCategoryLabels: Record<ProgramCategory, string> = {
  strength: "Musculation",
  cardio: "Cardio",
  flexibility: "Flexibilité",
  hiit: "HIIT",
  functional: "Fonctionnel",
  rehabilitation: "Rééducation",
};

export const DIFFICULTY_LEVEL_OPTIONS = Object.entries(
  DifficultyLevelLabels
).map(([value, label]) => ({ value, label }));

export const PROGRAM_CATEGORY_OPTIONS = Object.entries(
  ProgramCategoryLabels
).map(([value, label]) => ({ value, label }));

// Interface pour la duplication de programme
export interface ProgramDuplicateRequest {
  name: string;
  coach_id: number;
}

// Interface pour la formattage des exercices dans le formulaire
export interface ProgramFormExercise {
  exercise_id: number;
  exercise_name: string;
  muscle_category: string;
  order_number: number;
  sets?: number;
  repetitions?: number;
  recommended_weight?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  instructions?: string;
}
