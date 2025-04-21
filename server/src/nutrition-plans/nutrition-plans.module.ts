import { Module } from '@nestjs/common';
import { NutritionPlansService } from './nutrition-plans.service';
import { NutritionPlansController } from './nutrition-plans.controller';

@Module({
  controllers: [NutritionPlansController],
  providers: [NutritionPlansService],
})
export class NutritionPlansModule {}
