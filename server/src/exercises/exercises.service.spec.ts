import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { Repository } from 'typeorm';

describe('ExercisesService', () => {
  let service: ExercisesService;
  let repo: Repository<Exercise>;

  const mockExerciseRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: getRepositoryToken(Exercise),
          useValue: mockExerciseRepository,
        },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    repo = module.get<Repository<Exercise>>(getRepositoryToken(Exercise));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an exercise', async () => {
    const dto = {
      name: 'Squat',
      muscle_category: 'legs',
      difficulty_level: 'beginner',
    };
    const entity = { ...dto, exercise_id: 1 };
    mockExerciseRepository.create.mockReturnValue(dto);
    mockExerciseRepository.save.mockResolvedValue(entity);

    const result = await service.create(dto as any);
    expect(result).toEqual(entity);
    expect(mockExerciseRepository.save).toHaveBeenCalledWith(dto);
  });

  it('should find all exercises with pagination', async () => {
    mockExerciseRepository.findAndCount.mockResolvedValue([[{ exercise_id: 1 }], 1]);
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
  });

  it('should throw NotFoundException if exercise not found', async () => {
    mockExerciseRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow('Exercise with id 999 not found');
  });
});
