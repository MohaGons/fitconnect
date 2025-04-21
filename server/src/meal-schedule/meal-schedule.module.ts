import { Module } from '@nestjs/common';
import { MealScheduleService } from './meal-schedule.service';
import { MealScheduleController } from './meal-schedule.controller';

@Module({
  controllers: [MealScheduleController],
  providers: [MealScheduleService],
})
export class MealScheduleModule {}
