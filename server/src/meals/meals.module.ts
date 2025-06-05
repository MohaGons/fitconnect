import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { Meal } from './entities/meal.entity';
import { MealFood } from '../meal-foods/entities/meal-food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, MealFood])],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
