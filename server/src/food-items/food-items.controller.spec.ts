import { Test, TestingModule } from '@nestjs/testing';
import { FoodItemsController } from './food-items.controller';
import { FoodItemsService } from './food-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FoodItem } from './entities/food-item.entity';
import { MealFood } from '../meal-foods/entities/meal-food.entity';

describe('FoodItemsController', () => {
  let controller: FoodItemsController;

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
      controllers: [FoodItemsController],
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

    controller = module.get<FoodItemsController>(FoodItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
