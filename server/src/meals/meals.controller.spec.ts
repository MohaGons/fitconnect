import { Test, TestingModule } from '@nestjs/testing';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { MealFood } from '../meal-foods/entities/meal-food.entity';

describe('MealsController', () => {
  let controller: MealsController;

  const mockMealRepository = {
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
      controllers: [MealsController],
      providers: [
        MealsService,
        {
          provide: getRepositoryToken(Meal),
          useValue: mockMealRepository,
        },
        {
          provide: getRepositoryToken(MealFood),
          useValue: mockMealFoodRepository,
        },
      ],
    }).compile();

    controller = module.get<MealsController>(MealsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
