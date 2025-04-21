import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NutritionPlansService } from './nutrition-plans.service';
import { CreateNutritionPlanDto } from './dto/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dto/update-nutrition-plan.dto';

@Controller('nutrition-plans')
export class NutritionPlansController {
  constructor(private readonly nutritionPlansService: NutritionPlansService) {}

  @Post()
  create(@Body() createNutritionPlanDto: CreateNutritionPlanDto) {
    return this.nutritionPlansService.create(createNutritionPlanDto);
  }

  @Get()
  findAll() {
    return this.nutritionPlansService.findAll();
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
