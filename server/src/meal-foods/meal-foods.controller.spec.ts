import { Test, TestingModule } from '@nestjs/testing';
import { MealFoodsController } from './meal-foods.controller';
import { MealFoodsService } from './meal-foods.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MealFood } from './entities/meal-food.entity';

describe('MealFoodsController', () => {
  let controller: MealFoodsController;

  const mockMealFoodRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealFoodsController],
      providers: [
        MealFoodsService,
        {
          provide: getRepositoryToken(MealFood),
          useValue: mockMealFoodRepository,
        },
      ],
    }).compile();

    controller = module.get<MealFoodsController>(MealFoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
