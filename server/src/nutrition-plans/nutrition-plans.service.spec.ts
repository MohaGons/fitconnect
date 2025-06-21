import { Test, TestingModule } from '@nestjs/testing';
import { NutritionPlansService } from './nutrition-plans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NutritionPlan } from './entities/nutrition-plan.entity';
import { Meal } from '../meals/entities/meal.entity';

describe('NutritionPlansService', () => {
  let service: NutritionPlansService;
  const mockPlanRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: function () { return this; },
      andWhere: function () { return this; },
      skip: function () { return this; },
      take: function () { return this; },
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      getSql: jest.fn(),
      getParameters: jest.fn(),
    }),
  };
  const mockMealRepo = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutritionPlansService,
        { provide: getRepositoryToken(NutritionPlan), useValue: mockPlanRepo },
        { provide: getRepositoryToken(Meal), useValue: mockMealRepo },
      ],
    }).compile();

    service = module.get<NutritionPlansService>(NutritionPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a nutrition plan', async () => {
    const dto = { coach_id: 1, client_id: 1 };
    const entity = { ...dto, plan_id: 1 };
    mockPlanRepo.create.mockReturnValue(entity);
    mockPlanRepo.save.mockResolvedValue(entity);

    const result = await service.create(dto as any);
    expect(result).toEqual(entity);
  });

  it('should find all nutrition plans with filters', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('should remove a nutrition plan and update meals', async () => {
    mockMealRepo.update.mockResolvedValue(undefined);
    mockPlanRepo.delete.mockResolvedValue(undefined);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockMealRepo.update).toHaveBeenCalledWith({ plan_id: 1 }, { plan_id: null });
    expect(mockPlanRepo.delete).toHaveBeenCalledWith(1);
  });
});
