import { Test, TestingModule } from '@nestjs/testing';
import { MealFoodsController } from './meal-foods.controller';
import { MealFoodsService } from './meal-foods.service';

describe('MealFoodsController', () => {
  let controller: MealFoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealFoodsController],
      providers: [MealFoodsService],
    }).compile();

    controller = module.get<MealFoodsController>(MealFoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
