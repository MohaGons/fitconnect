import { Test, TestingModule } from '@nestjs/testing';
import { ProgressTrackingController } from './progress-tracking.controller';
import { ProgressTrackingService } from './progress-tracking.service';

describe('ProgressTrackingController', () => {
  let controller: ProgressTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressTrackingController],
      providers: [ProgressTrackingService],
    }).compile();

    controller = module.get<ProgressTrackingController>(
      ProgressTrackingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
