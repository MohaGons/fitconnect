import { Test, TestingModule } from '@nestjs/testing';
import { NutritionPlansService } from './nutrition-plans.service';

describe('NutritionPlansService', () => {
  let service: NutritionPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NutritionPlansService],
    }).compile();

    service = module.get<NutritionPlansService>(NutritionPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
