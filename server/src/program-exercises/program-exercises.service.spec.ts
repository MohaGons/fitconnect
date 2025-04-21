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
});
