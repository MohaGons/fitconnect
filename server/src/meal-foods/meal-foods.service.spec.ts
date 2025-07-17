import { Test, TestingModule } from '@nestjs/testing';
import { MealFoodsService } from './meal-foods.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MealFood } from './entities/meal-food.entity';

describe('MealFoodsService', () => {
  let service: MealFoodsService;

  const mockMealFoodRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealFoodsService,
        {
          provide: getRepositoryToken(MealFood),
          useValue: mockMealFoodRepository,
        },
      ],
    }).compile();

    service = module.get<MealFoodsService>(MealFoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
