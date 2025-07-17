import { Test, TestingModule } from '@nestjs/testing';
import { ClientGoalsService } from './client-goals.service';

describe('ClientGoalsService', () => {
  let service: ClientGoalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientGoalsService],
    }).compile();

    service = module.get<ClientGoalsService>(ClientGoalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
