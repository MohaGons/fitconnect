// Exemple pour features/coaches/types.ts
export interface Coach {
  coach_id: number;
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  certifications: string | null;
  availability: string | null;
  specialty: string | null;
  photo: string | null;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoachCreate {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  certifications?: string;
  availability?: string;
  specialty?: string;
  photo?: string;
}

export interface CoachUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  certifications?: string;
  availability?: string;
  specialty?: string;
  photo?: string;
  deleted?: boolean;
}

export interface CoachFilters {
  page?: number;
  limit?: number;
  search?: string;
  deleted?: boolean;
}

export interface PaginatedResponse<T>{
  data?: T[];
}