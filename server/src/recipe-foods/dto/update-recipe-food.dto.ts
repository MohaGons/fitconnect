import { PartialType } from '@nestjs/swagger';
import { CreateRecipeFoodDto } from './create-recipe-food.dto';

export class UpdateRecipeFoodDto extends PartialType(CreateRecipeFoodDto) {}
