import { Module } from '@nestjs/common';
import { MealFoodsService } from './meal-foods.service';
import { MealFoodsController } from './meal-foods.controller';

@Module({
  controllers: [MealFoodsController],
  providers: [MealFoodsService],
})
export class MealFoodsModule {}
