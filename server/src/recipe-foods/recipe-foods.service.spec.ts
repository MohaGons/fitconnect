import { Test, TestingModule } from '@nestjs/testing';
import { RecipeFoodsService } from './recipe-foods.service';

describe('RecipeFoodsService', () => {
  let service: RecipeFoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeFoodsService],
    }).compile();

    service = module.get<RecipeFoodsService>(RecipeFoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
