import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MealFoodsService } from './meal-foods.service';
import { CreateMealFoodDto } from './dto/create-meal-food.dto';
import { UpdateMealFoodDto } from './dto/update-meal-food.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
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

  @Get('meal/:mealId')
  findByMealId(@Param('mealId') mealId: string) {
    return this.mealFoodsService.findByMealId(+mealId);
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

  @Delete('meal/:mealId')
  removeByMealId(@Param('mealId') mealId: string) {
    return this.mealFoodsService.removeByMealId(+mealId);
  }
}
