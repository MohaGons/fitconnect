import { Test, TestingModule } from '@nestjs/testing';
import { NutritionPlansController } from './nutrition-plans.controller';
import { NutritionPlansService } from './nutrition-plans.service';

describe('NutritionPlansController', () => {
  let controller: NutritionPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NutritionPlansController],
      providers: [NutritionPlansService],
    }).compile();

    controller = module.get<NutritionPlansController>(NutritionPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
