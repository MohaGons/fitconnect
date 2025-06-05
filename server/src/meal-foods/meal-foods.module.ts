import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealFoodsService } from './meal-foods.service';
import { MealFoodsController } from './meal-foods.controller';
import { MealFood } from './entities/meal-food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealFood])],
  controllers: [MealFoodsController],
  providers: [MealFoodsService],
  exports: [MealFoodsService],
})
export class MealFoodsModule {}
