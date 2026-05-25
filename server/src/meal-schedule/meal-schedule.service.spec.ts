import { Test, TestingModule } from '@nestjs/testing';
import { MealScheduleService } from './meal-schedule.service';

describe('MealScheduleService', () => {
  let service: MealScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealScheduleService],
    }).compile();

    service = module.get<MealScheduleService>(MealScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
