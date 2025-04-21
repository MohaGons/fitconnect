import { Test, TestingModule } from '@nestjs/testing';
import { ProgressTrackingService } from './progress-tracking.service';

describe('ProgressTrackingService', () => {
  let service: ProgressTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressTrackingService],
    }).compile();

    service = module.get<ProgressTrackingService>(ProgressTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
