import { Test, TestingModule } from '@nestjs/testing';
import { ProgramExercisesService } from './program-exercises.service';

describe('ProgramExercisesService', () => {
  let service: ProgramExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramExercisesService],
    }).compile();

    service = module.get<ProgramExercisesService>(ProgramExercisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a string for create', () => {
    expect(service.create({} as any)).toBe('This action adds a new programExercise');
  });

  it('should return a string for findAll', () => {
    expect(service.findAll()).toBe('This action returns all programExercises');
  });

  it('should return a string for findOne', () => {
    expect(service.findOne(5)).toBe('This action returns a #5 programExercise');
  });
});
