import { Test, TestingModule } from '@nestjs/testing';
import { MealScheduleController } from './meal-schedule.controller';
import { MealScheduleService } from './meal-schedule.service';

describe('MealScheduleController', () => {
  let controller: MealScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealScheduleController],
      providers: [MealScheduleService],
    }).compile();

    controller = module.get<MealScheduleController>(MealScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
