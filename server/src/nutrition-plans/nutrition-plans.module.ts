import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionPlansService } from './nutrition-plans.service';
import { NutritionPlansController } from './nutrition-plans.controller';
import { NutritionPlan } from './entities/nutrition-plan.entity';
import { Meal } from '../meals/entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NutritionPlan, Meal])],
  controllers: [NutritionPlansController],
  providers: [NutritionPlansService],
})
export class NutritionPlansModule {}
