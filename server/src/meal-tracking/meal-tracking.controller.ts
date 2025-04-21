import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MealTrackingService } from './meal-tracking.service';
import { CreateMealTrackingDto } from './dto/create-meal-tracking.dto';
import { UpdateMealTrackingDto } from './dto/update-meal-tracking.dto';

@Controller('meal-tracking')
export class MealTrackingController {
  constructor(private readonly mealTrackingService: MealTrackingService) {}

  @Post()
  create(@Body() createMealTrackingDto: CreateMealTrackingDto) {
    return this.mealTrackingService.create(createMealTrackingDto);
  }

  @Get()
  findAll() {
    return this.mealTrackingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealTrackingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMealTrackingDto: UpdateMealTrackingDto,
  ) {
    return this.mealTrackingService.update(+id, updateMealTrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mealTrackingService.remove(+id);
  }
}
