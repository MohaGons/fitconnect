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
import { NutritionPlansService } from './nutrition-plans.service';
import { CreateNutritionPlanDto } from './dto/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dto/update-nutrition-plan.dto';

interface QueryFilters {
  page?: string;
  limit?: string;
  goal?: string;
  search?: string;
}

@Controller('nutrition-plans')
export class NutritionPlansController {
  constructor(private readonly nutritionPlansService: NutritionPlansService) {}

  @Post()
  create(@Body() createNutritionPlanDto: CreateNutritionPlanDto) {
    return this.nutritionPlansService.create(createNutritionPlanDto);
  }

  @Get()
  async findAll(@Query() query: QueryFilters) {
    const { page, limit, goal, search } = query;
    const filters = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      goal,
      search,
    };
    const { data, total } = await this.nutritionPlansService.findAll(filters);
    return {
      data,
      total,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nutritionPlansService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNutritionPlanDto: UpdateNutritionPlanDto,
  ) {
    return this.nutritionPlansService.update(+id, updateNutritionPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nutritionPlansService.remove(+id);
  }
}
