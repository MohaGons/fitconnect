import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItemsService } from './food-items.service';
import { FoodItemsController } from './food-items.controller';
import { FoodItem } from './entities/food-item.entity';
import { MealFood } from '../meal-foods/entities/meal-food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodItem, MealFood])],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
  exports: [FoodItemsService],
})
export class FoodItemsModule {}
