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
import { MealScheduleService } from './meal-schedule.service';
import { CreateMealScheduleDto } from './dto/create-meal-schedule.dto';
import { UpdateMealScheduleDto } from './dto/update-meal-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('meal-schedule')
export class MealScheduleController {
  constructor(private readonly mealScheduleService: MealScheduleService) {}

  @Post()
  create(@Body() createMealScheduleDto: CreateMealScheduleDto) {
    return this.mealScheduleService.create(createMealScheduleDto);
  }

  @Get()
  findAll() {
    return this.mealScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMealScheduleDto: UpdateMealScheduleDto,
  ) {
    return this.mealScheduleService.update(+id, updateMealScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mealScheduleService.remove(+id);
  }
}
