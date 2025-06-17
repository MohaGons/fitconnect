// Types pour les événements du calendrier
export interface ApiCalendarEvent {
  event_id: number;
  coach_id: number;
  client_id: number;
  title: string;
  type: 'session' | 'meal';
  start_datetime: string;
  end_datetime?: string;
  status: string;
  coach_notes?: string;
  client_notes?: string;
  duration?: string;
  session_type?: string;
  meal_type?: string;
  calories?: number;
  program_id?: number;
  meal_id?: number;
  created_at: string;
  updated_at: string;
  coach?: {
    coach_id: number;
    user_id: string;
  };
  client?: {
    client_id: number;
    user_id: string;
  };
}

export interface CreateEventDto {
  coach_id: number;
  client_id: number;
  title: string;
  type: 'session' | 'meal';
  start_datetime: string;
  end_datetime?: string;
  status: string;
  coach_notes?: string;
  session_type?: string;
  duration?: string;
  program_id?: number;
  meal_type?: string;
  calories?: number;
  meal_id?: number;
}

export interface UpdateEventDto {
  title?: string;
  start_datetime?: string | Date;
  end_datetime?: string | Date;
  status?: string;
  coach_notes?: string;
  client_notes?: string;
  session_type?: string;
  duration?: string;
  meal_type?: string;
  calories?: number;
}

export interface ScheduleSessionDto {
  coach_id: number;
  client_id: number;
  program_id: number;
  start_datetime: string;
  end_datetime?: string;
  duration?: string;
  coach_notes?: string;
  status?: string;
}

export interface ScheduleMealDto {
  coach_id: number;
  client_id: number;
  meal_id: number;
  start_datetime: string;
  meal_type?: string;
  calories?: number;
  coach_notes?: string;
  status?: string;
}

// Types pour les entités
export interface ClientInfo {
  client_id: number;
  user_id: string;
  firstName?: string;
  lastName?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachInfo {
  coach_id: number;
  user_id: string;
  bio?: string;
  specializations?: string;
  certifications?: string;
  created_at: string;
  updated_at: string;
}

export interface Program {
  program_id: number;
  coach_id: number;
  name: string;
  description?: string;
  category?: string;
  difficulty_level?: string;
  duration_weeks?: number;
  sessions_per_week?: number;
  created_at: string;
  updated_at: string;
}

export interface Meal {
  meal_id: number;
  plan_id?: number;
  name: string;
  description?: string;
  meal_type?: string;
  total_calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  preparation_time?: string;
  ingredients?: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
  nutrition_plan?: {
    plan_id: number;
    coach_id: number;
    name: string;
  };
}

export interface PlanningOptions {
  programs: Program[];
  meals: Meal[];
  clients: ClientInfo[];
}

export type EventType = 'session' | 'meal';
export type SessionType = 'musculation' | 'cardio' | 'hiit' | 'yoga';
export type MealType = 'petit-dejeuner' | 'collation-matin' | 'dejeuner' | 'collation-apres-midi' | 'diner' | 'collation-soir';
export type EventStatus = 'planned' | 'completed' | 'cancelled' | 'in_progress';