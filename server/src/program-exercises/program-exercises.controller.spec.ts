import { Test, TestingModule } from '@nestjs/testing';
import { ProgramExercisesController } from './program-exercises.controller';
import { ProgramExercisesService } from './program-exercises.service';

describe('ProgramExercisesController', () => {
  let controller: ProgramExercisesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramExercisesController],
      providers: [ProgramExercisesService],
    }).compile();

    controller = module.get<ProgramExercisesController>(
      ProgramExercisesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
