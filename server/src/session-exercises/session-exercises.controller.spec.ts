import { Test, TestingModule } from '@nestjs/testing';
import { SessionExercisesController } from './session-exercises.controller';
import { SessionExercisesService } from './session-exercises.service';

describe('SessionExercisesController', () => {
  let controller: SessionExercisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionExercisesController],
      providers: [SessionExercisesService],
    }).compile();

    controller = module.get<SessionExercisesController>(
      SessionExercisesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
