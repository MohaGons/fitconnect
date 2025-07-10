export interface UserTestData {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'coach' | 'admin';
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientTestData extends UserTestData {
  role: 'client';
  goals?: string[];
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredWorkoutTime?: string;
  medicalConditions?: string[];
}

export interface CoachTestData extends UserTestData {
  role: 'coach';
  certifications?: string[];
  specialties?: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: string[];
  bio?: string;
}

export class UserFactory {
  static createUser(overrides: Partial<UserTestData> = {}): UserTestData {
    const id =
      overrides.id ||
      `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      email: overrides.email || `user-${id}@test.com`,
      firstName: overrides.firstName || 'Test',
      lastName: overrides.lastName || 'User',
      role: overrides.role || 'client',
      isActive: overrides.isActive !== undefined ? overrides.isActive : true,
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  static createClient(overrides: Partial<ClientTestData> = {}): ClientTestData {
    const baseUser = this.createUser({ role: 'client', ...overrides });

    return {
      ...baseUser,
      role: 'client',
      goals: overrides.goals || ['weight_loss', 'muscle_gain'],
      fitnessLevel: overrides.fitnessLevel || 'beginner',
      preferredWorkoutTime: overrides.preferredWorkoutTime || 'evening',
      medicalConditions: overrides.medicalConditions || [],
      ...overrides,
    };
  }

  static createCoach(overrides: Partial<CoachTestData> = {}): CoachTestData {
    const baseUser = this.createUser({ role: 'coach', ...overrides });

    return {
      ...baseUser,
      role: 'coach',
      certifications: overrides.certifications || ['NASM-CPT', 'ACE'],
      specialties: overrides.specialties || ['weight_training', 'cardio'],
      experience: overrides.experience || 3,
      hourlyRate: overrides.hourlyRate || 80,
      availability: overrides.availability || ['morning', 'afternoon'],
      bio:
        overrides.bio ||
        'Experienced fitness coach dedicated to helping clients achieve their goals.',
      ...overrides,
    };
  }

  static createAdmin(overrides: Partial<UserTestData> = {}): UserTestData {
    return this.createUser({
      role: 'admin',
      email: overrides.email || 'admin@test.com',
      firstName: overrides.firstName || 'Admin',
      lastName: overrides.lastName || 'User',
      ...overrides,
    });
  }

  // Création en lot
  static createUsers(
    count: number,
    overrides: Partial<UserTestData> = {},
  ): UserTestData[] {
    return Array.from({ length: count }, (_, index) =>
      this.createUser({
        ...overrides,
        email: `user-${index}@test.com`,
        firstName: `Test${index}`,
      }),
    );
  }

  static createClients(
    count: number,
    overrides: Partial<ClientTestData> = {},
  ): ClientTestData[] {
    return Array.from({ length: count }, (_, index) =>
      this.createClient({
        ...overrides,
        email: `client-${index}@test.com`,
        firstName: `Client${index}`,
      }),
    );
  }

  static createCoaches(
    count: number,
    overrides: Partial<CoachTestData> = {},
  ): CoachTestData[] {
    return Array.from({ length: count }, (_, index) =>
      this.createCoach({
        ...overrides,
        email: `coach-${index}@test.com`,
        firstName: `Coach${index}`,
      }),
    );
  }
}
