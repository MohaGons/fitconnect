import { Test, TestingModule } from '@nestjs/testing';
import { FoodItemsService } from './food-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FoodItem } from './entities/food-item.entity';
import { MealFood } from '../meal-foods/entities/meal-food.entity';

describe('FoodItemsService', () => {
  let service: FoodItemsService;

  const mockFoodItemRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

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
        FoodItemsService,
        {
          provide: getRepositoryToken(FoodItem),
          useValue: mockFoodItemRepository,
        },
        {
          provide: getRepositoryToken(MealFood),
          useValue: mockMealFoodRepository,
        },
      ],
    }).compile();

    service = module.get<FoodItemsService>(FoodItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
