import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MealFoodsService } from './meal-foods.service';
import { CreateMealFoodDto } from './dto/create-meal-food.dto';
import { UpdateMealFoodDto } from './dto/update-meal-food.dto';

@Controller('meal-foods')
export class MealFoodsController {
  constructor(private readonly mealFoodsService: MealFoodsService) {}

  @Post()
  create(@Body() createMealFoodDto: CreateMealFoodDto) {
    return this.mealFoodsService.create(createMealFoodDto);
  }

  @Get()
  findAll() {
    return this.mealFoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealFoodsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMealFoodDto: UpdateMealFoodDto,
  ) {
    return this.mealFoodsService.update(+id, updateMealFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mealFoodsService.remove(+id);
  }
}
