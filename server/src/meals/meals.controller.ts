import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

interface QueryFilters {
  page?: string;
  limit?: string;
  plan_id?: string;
  meal_type?: string;
  search?: string;
}

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  create(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.create(createMealDto);
  }

  @Get()
  async findAll(@Query() query: QueryFilters) {
    const { page, limit, plan_id, meal_type, search } = query;
    const filters = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      plan_id: plan_id ? parseInt(plan_id, 10) : undefined,
      meal_type,
      search,
    };
    const { data, total } = await this.mealsService.findAll(filters);
    return {
      data,
      total,
    };
  }

  @Get('by-plan/:planId')
  findByPlanId(@Param('planId') planId: string) {
    return this.mealsService.findByPlanId(+planId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealsService.update(+id, updateMealDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mealsService.remove(+id);
  }
}
