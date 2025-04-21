import { Test, TestingModule } from '@nestjs/testing';
import { ProgressPhotosController } from './progress-photos.controller';
import { ProgressPhotosService } from './progress-photos.service';

describe('ProgressPhotosController', () => {
  let controller: ProgressPhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressPhotosController],
      providers: [ProgressPhotosService],
    }).compile();

    controller = module.get<ProgressPhotosController>(ProgressPhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
