import { Test, TestingModule } from '@nestjs/testing';
import { RecipeFoodsController } from './recipe-foods.controller';
import { RecipeFoodsService } from './recipe-foods.service';

describe('RecipeFoodsController', () => {
  let controller: RecipeFoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeFoodsController],
      providers: [RecipeFoodsService],
    }).compile();

    controller = module.get<RecipeFoodsController>(RecipeFoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
