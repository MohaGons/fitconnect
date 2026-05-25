import { Test, TestingModule } from '@nestjs/testing';
import { MealTrackingController } from './meal-tracking.controller';
import { MealTrackingService } from './meal-tracking.service';

describe('MealTrackingController', () => {
  let controller: MealTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealTrackingController],
      providers: [MealTrackingService],
    }).compile();

    controller = module.get<MealTrackingController>(MealTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
