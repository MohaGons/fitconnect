import { Module } from '@nestjs/common';
import { ProgressPhotosService } from './progress-photos.service';
import { ProgressPhotosController } from './progress-photos.controller';

@Module({
  controllers: [ProgressPhotosController],
  providers: [ProgressPhotosService],
})
export class ProgressPhotosModule {}
