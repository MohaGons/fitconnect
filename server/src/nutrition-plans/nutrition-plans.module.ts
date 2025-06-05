import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionPlansService } from './nutrition-plans.service';
import { NutritionPlansController } from './nutrition-plans.controller';
import { NutritionPlan } from './entities/nutrition-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NutritionPlan])],
  controllers: [NutritionPlansController],
  providers: [NutritionPlansService],
})
export class NutritionPlansModule {}
