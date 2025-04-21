import { Test, TestingModule } from '@nestjs/testing';
import { MealFoodsService } from './meal-foods.service';

describe('MealFoodsService', () => {
  let service: MealFoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealFoodsService],
    }).compile();

    service = module.get<MealFoodsService>(MealFoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
