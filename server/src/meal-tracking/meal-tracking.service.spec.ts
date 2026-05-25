import { Test, TestingModule } from '@nestjs/testing';
import { MealTrackingService } from './meal-tracking.service';

describe('MealTrackingService', () => {
  let service: MealTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealTrackingService],
    }).compile();

    service = module.get<MealTrackingService>(MealTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
