import { Module } from '@nestjs/common';
import { MealTrackingService } from './meal-tracking.service';
import { MealTrackingController } from './meal-tracking.controller';

@Module({
  controllers: [MealTrackingController],
  providers: [MealTrackingService],
})
export class MealTrackingModule {}
