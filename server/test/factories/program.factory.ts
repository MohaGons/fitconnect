export interface ProgramTestData {
  id?: string;
  name: string;
  description: string;
  duration: number; // en semaines
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  coachId: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExerciseTestData {
  id?: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkoutTestData {
  id?: string;
  name: string;
  description: string;
  programId: string;
  orderIndex: number;
  estimatedDuration: number; // en minutes
  exercises: WorkoutExerciseTestData[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkoutExerciseTestData {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // en secondes pour les exercices de temps
  restTime: number; // en secondes
  notes?: string;
}

export class ProgramFactory {
  static createProgram(
    overrides: Partial<ProgramTestData> = {},
  ): ProgramTestData {
    const id =
      overrides.id ||
      `program-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      name: overrides.name || 'Test Fitness Program',
      description:
        overrides.description ||
        'A comprehensive fitness program designed for testing purposes.',
      duration: overrides.duration || 8,
      difficulty: overrides.difficulty || 'intermediate',
      type: overrides.type || 'mixed',
      coachId: overrides.coachId || 'test-coach-id',
      isActive: overrides.isActive !== undefined ? overrides.isActive : true,
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  static createExercise(
    overrides: Partial<ExerciseTestData> = {},
  ): ExerciseTestData {
    const id =
      overrides.id ||
      `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      name: overrides.name || 'Test Exercise',
      description:
        overrides.description || 'A test exercise for fitness programs.',
      muscleGroups: overrides.muscleGroups || ['chest', 'arms'],
      equipment: overrides.equipment || ['dumbbells'],
      instructions: overrides.instructions || [
        'Set up in starting position',
        'Perform the movement with controlled form',
        'Return to starting position',
        'Repeat for specified reps',
      ],
      difficulty: overrides.difficulty || 'intermediate',
      videoUrl: overrides.videoUrl || 'https://example.com/exercise-video.mp4',
      imageUrl: overrides.imageUrl || 'https://example.com/exercise-image.jpg',
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  static createWorkout(
    overrides: Partial<WorkoutTestData> = {},
  ): WorkoutTestData {
    const id =
      overrides.id ||
      `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      name: overrides.name || 'Test Workout',
      description: overrides.description || 'A test workout session.',
      programId: overrides.programId || 'test-program-id',
      orderIndex: overrides.orderIndex || 1,
      estimatedDuration: overrides.estimatedDuration || 45,
      exercises: overrides.exercises || [
        this.createWorkoutExercise(),
        this.createWorkoutExercise({ exerciseId: 'exercise-2' }),
      ],
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
      ...overrides,
    };
  }

  static createWorkoutExercise(
    overrides: Partial<WorkoutExerciseTestData> = {},
  ): WorkoutExerciseTestData {
    return {
      exerciseId: overrides.exerciseId || 'test-exercise-id',
      sets: overrides.sets || 3,
      reps: overrides.reps || 12,
      weight: overrides.weight || 20,
      duration: overrides.duration,
      restTime: overrides.restTime || 60,
      notes: overrides.notes || 'Focus on proper form',
      ...overrides,
    };
  }

  // Programmes prédéfinis pour différents objectifs
  static createStrengthProgram(
    coachId: string,
    overrides: Partial<ProgramTestData> = {},
  ): ProgramTestData {
    return this.createProgram({
      name: 'Strength Building Program',
      description:
        'A comprehensive program focused on building raw strength and muscle mass.',
      duration: 12,
      difficulty: 'intermediate',
      type: 'strength',
      coachId,
      ...overrides,
    });
  }

  static createCardioProgram(
    coachId: string,
    overrides: Partial<ProgramTestData> = {},
  ): ProgramTestData {
    return this.createProgram({
      name: 'Cardio Endurance Program',
      description:
        'High-intensity cardio program to improve cardiovascular health and endurance.',
      duration: 6,
      difficulty: 'beginner',
      type: 'cardio',
      coachId,
      ...overrides,
    });
  }

  static createBeginnerProgram(
    coachId: string,
    overrides: Partial<ProgramTestData> = {},
  ): ProgramTestData {
    return this.createProgram({
      name: 'Beginner Fitness Journey',
      description: 'Perfect program for those starting their fitness journey.',
      duration: 4,
      difficulty: 'beginner',
      type: 'mixed',
      coachId,
      ...overrides,
    });
  }

  // Exercices prédéfinis
  static createPushUpExercise(
    overrides: Partial<ExerciseTestData> = {},
  ): ExerciseTestData {
    return this.createExercise({
      name: 'Push-Up',
      description: 'Classic bodyweight upper body exercise.',
      muscleGroups: ['chest', 'arms', 'shoulders'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      ...overrides,
    });
  }

  static createSquatExercise(
    overrides: Partial<ExerciseTestData> = {},
  ): ExerciseTestData {
    return this.createExercise({
      name: 'Squat',
      description: 'Fundamental lower body compound movement.',
      muscleGroups: ['legs', 'glutes'],
      equipment: ['bodyweight'],
      difficulty: 'beginner',
      ...overrides,
    });
  }

  static createDeadliftExercise(
    overrides: Partial<ExerciseTestData> = {},
  ): ExerciseTestData {
    return this.createExercise({
      name: 'Deadlift',
      description: 'King of all exercises - full body compound movement.',
      muscleGroups: ['back', 'legs', 'glutes', 'core'],
      equipment: ['barbell', 'weights'],
      difficulty: 'advanced',
      ...overrides,
    });
  }

  // Création en lot
  static createPrograms(
    count: number,
    coachId: string,
    overrides: Partial<ProgramTestData> = {},
  ): ProgramTestData[] {
    return Array.from({ length: count }, (_, index) =>
      this.createProgram({
        ...overrides,
        name: `Test Program ${index + 1}`,
        coachId,
      }),
    );
  }

  static createExercises(
    count: number,
    overrides: Partial<ExerciseTestData> = {},
  ): ExerciseTestData[] {
    return Array.from({ length: count }, (_, index) =>
      this.createExercise({
        ...overrides,
        name: `Test Exercise ${index + 1}`,
      }),
    );
  }
}
