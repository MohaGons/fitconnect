import { UserFactory } from '../factories/user.factory';
import { ProgramFactory } from '../factories/program.factory';

describe('Factories Test (e2e)', () => {
  describe('UserFactory', () => {
    it('should create a basic user', () => {
      const user = UserFactory.createUser({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.role).toBe('client');
      expect(user.isActive).toBe(true);
      expect(user.id).toBeDefined();
    });

    it('should create a client with specific data', () => {
      const client = UserFactory.createClient({
        email: 'client@test.com',
        goals: ['weight_loss', 'muscle_gain'],
        fitnessLevel: 'intermediate',
      });

      expect(client.role).toBe('client');
      expect(client.goals).toEqual(['weight_loss', 'muscle_gain']);
      expect(client.fitnessLevel).toBe('intermediate');
      expect(client.email).toBe('client@test.com');
    });

    it('should create a coach with certifications', () => {
      const coach = UserFactory.createCoach({
        email: 'coach@test.com',
        specialties: ['strength_training', 'cardio'],
        certifications: ['NASM-CPT'],
        hourlyRate: 85,
      });

      expect(coach.role).toBe('coach');
      expect(coach.specialties).toEqual(['strength_training', 'cardio']);
      expect(coach.certifications).toEqual(['NASM-CPT']);
      expect(coach.hourlyRate).toBe(85);
    });

    it('should create multiple users', () => {
      const users = UserFactory.createUsers(3, { role: 'client' });

      expect(users).toHaveLength(3);
      users.forEach((user, index) => {
        expect(user.role).toBe('client');
        expect(user.email).toBe(`user-${index}@test.com`);
        expect(user.firstName).toBe(`Test${index}`);
      });
    });

    it('should create an admin user', () => {
      const admin = UserFactory.createAdmin({
        email: 'admin@test.com',
      });

      expect(admin.role).toBe('admin');
      expect(admin.email).toBe('admin@test.com');
      expect(admin.firstName).toBe('Admin');
    });
  });

  describe('ProgramFactory', () => {
    it('should create a basic program', () => {
      const program = ProgramFactory.createProgram({
        name: 'Test Program',
        coachId: 'coach-123',
      });

      expect(program).toBeDefined();
      expect(program.name).toBe('Test Program');
      expect(program.coachId).toBe('coach-123');
      expect(program.duration).toBe(8);
      expect(program.difficulty).toBe('intermediate');
      expect(program.type).toBe('mixed');
    });

    it('should create a strength program', () => {
      const program = ProgramFactory.createStrengthProgram('coach-456');

      expect(program.type).toBe('strength');
      expect(program.name).toBe('Strength Building Program');
      expect(program.difficulty).toBe('intermediate');
      expect(program.duration).toBe(12);
      expect(program.coachId).toBe('coach-456');
    });

    it('should create a cardio program', () => {
      const program = ProgramFactory.createCardioProgram('coach-789');

      expect(program.type).toBe('cardio');
      expect(program.name).toBe('Cardio Endurance Program');
      expect(program.difficulty).toBe('beginner');
      expect(program.duration).toBe(6);
    });

    it('should create a beginner program', () => {
      const program = ProgramFactory.createBeginnerProgram('coach-101');

      expect(program.difficulty).toBe('beginner');
      expect(program.name).toBe('Beginner Fitness Journey');
      expect(program.duration).toBe(4);
      expect(program.type).toBe('mixed');
    });

    it('should create an exercise', () => {
      const exercise = ProgramFactory.createExercise({
        name: 'Test Exercise',
        muscleGroups: ['chest', 'arms'],
        equipment: ['dumbbells'],
      });

      expect(exercise.name).toBe('Test Exercise');
      expect(exercise.muscleGroups).toEqual(['chest', 'arms']);
      expect(exercise.equipment).toEqual(['dumbbells']);
      expect(exercise.difficulty).toBe('intermediate');
    });

    it('should create predefined exercises', () => {
      const pushUp = ProgramFactory.createPushUpExercise();
      const squat = ProgramFactory.createSquatExercise();
      const deadlift = ProgramFactory.createDeadliftExercise();

      expect(pushUp.name).toBe('Push-Up');
      expect(pushUp.difficulty).toBe('beginner');
      expect(pushUp.muscleGroups).toContain('chest');

      expect(squat.name).toBe('Squat');
      expect(squat.muscleGroups).toContain('legs');

      expect(deadlift.name).toBe('Deadlift');
      expect(deadlift.difficulty).toBe('advanced');
    });

    it('should create a workout with exercises', () => {
      const workout = ProgramFactory.createWorkout({
        name: 'Upper Body Workout',
        programId: 'program-123',
        estimatedDuration: 60,
      });

      expect(workout.name).toBe('Upper Body Workout');
      expect(workout.programId).toBe('program-123');
      expect(workout.estimatedDuration).toBe(60);
      expect(workout.exercises).toHaveLength(2);
      expect(workout.exercises[0].sets).toBe(3);
      expect(workout.exercises[0].reps).toBe(12);
    });

    it('should create multiple programs', () => {
      const programs = ProgramFactory.createPrograms(3, 'coach-999');

      expect(programs).toHaveLength(3);
      programs.forEach((program, index) => {
        expect(program.coachId).toBe('coach-999');
        expect(program.name).toBe(`Test Program ${index + 1}`);
      });
    });

    it('should create multiple exercises', () => {
      const exercises = ProgramFactory.createExercises(5);

      expect(exercises).toHaveLength(5);
      exercises.forEach((exercise, index) => {
        expect(exercise.name).toBe(`Test Exercise ${index + 1}`);
        expect(exercise.difficulty).toBe('intermediate');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should create a complete coach-program scenario', () => {
      // Créer un coach
      const coach = UserFactory.createCoach({
        email: 'integration-coach@test.com',
        specialties: ['strength_training'],
      });

      // Créer un programme pour ce coach
      const program = ProgramFactory.createStrengthProgram(coach.id!, {
        name: 'Coach Integration Program',
      });

      // Créer des exercices
      const exercises = [
        ProgramFactory.createPushUpExercise(),
        ProgramFactory.createSquatExercise(),
      ];

      // Créer un workout
      const workout = ProgramFactory.createWorkout({
        programId: program.id!,
        name: 'Integration Workout',
      });

      // Vérifications
      expect(coach.role).toBe('coach');
      expect(program.coachId).toBe(coach.id);
      expect(program.name).toBe('Coach Integration Program');
      expect(exercises).toHaveLength(2);
      expect(workout.programId).toBe(program.id);
    });

    it('should create a client-program assignment scenario', () => {
      // Créer un client
      const client = UserFactory.createClient({
        email: 'integration-client@test.com',
        goals: ['weight_loss'],
        fitnessLevel: 'beginner',
      });

      // Créer un coach
      const coach = UserFactory.createCoach({
        email: 'integration-coach2@test.com',
      });

      // Créer un programme adapté au client
      const program = ProgramFactory.createBeginnerProgram(coach.id!, {
        name: 'Client Beginner Program',
      });

      // Vérifications de cohérence
      expect(client.fitnessLevel).toBe('beginner');
      expect(program.difficulty).toBe('beginner');
      expect(program.coachId).toBe(coach.id);
      expect(client.goals).toContain('weight_loss');
    });
  });
});
