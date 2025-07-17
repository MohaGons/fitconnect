import { PartialType } from '@nestjs/swagger';
import { CreateNutritionPlanDto } from './create-nutrition-plan.dto';

export class UpdateNutritionPlanDto extends PartialType(
  CreateNutritionPlanDto,
) {}
