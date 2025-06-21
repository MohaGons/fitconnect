import { Test, TestingModule } from '@nestjs/testing';
import { NutritionPlansController } from './nutrition-plans.controller';
import { NutritionPlansService } from './nutrition-plans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NutritionPlan } from './entities/nutrition-plan.entity';
import { Meal } from '../meals/entities/meal.entity';

describe('NutritionPlansController', () => {
  let controller: NutritionPlansController;

  const mockNutritionPlanRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockMealRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionPlansController],
      providers: [
        NutritionPlansService,
        {
          provide: getRepositoryToken(NutritionPlan),
          useValue: mockNutritionPlanRepository,
        },
        {
          provide: getRepositoryToken(Meal),
          useValue: mockMealRepository,
        },
      ],
    }).compile();

    controller = module.get<NutritionPlansController>(NutritionPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
