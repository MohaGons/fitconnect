import { Module } from '@nestjs/common';
import { ProgressTrackingService } from './progress-tracking.service';
import { ProgressTrackingController } from './progress-tracking.controller';

@Module({
  controllers: [ProgressTrackingController],
  providers: [ProgressTrackingService],
})
export class ProgressTrackingModule {}
