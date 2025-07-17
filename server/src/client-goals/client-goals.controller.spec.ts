import { Test, TestingModule } from '@nestjs/testing';
import { ClientGoalsController } from './client-goals.controller';
import { ClientGoalsService } from './client-goals.service';

describe('ClientGoalsController', () => {
  let controller: ClientGoalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientGoalsController],
      providers: [ClientGoalsService],
    }).compile();

    controller = module.get<ClientGoalsController>(ClientGoalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
