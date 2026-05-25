import { Test, TestingModule } from '@nestjs/testing';
import { SessionExercisesService } from './session-exercises.service';

describe('SessionExercisesService', () => {
  let service: SessionExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionExercisesService],
    }).compile();

    service = module.get<SessionExercisesService>(SessionExercisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
