import { Test, TestingModule } from '@nestjs/testing';
import { ProgressPhotosService } from './progress-photos.service';

describe('ProgressPhotosService', () => {
  let service: ProgressPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressPhotosService],
    }).compile();

    service = module.get<ProgressPhotosService>(ProgressPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
