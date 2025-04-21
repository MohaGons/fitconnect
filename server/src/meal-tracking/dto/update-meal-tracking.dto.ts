import { PartialType } from '@nestjs/swagger';
import { CreateMealTrackingDto } from './create-meal-tracking.dto';

export class UpdateMealTrackingDto extends PartialType(CreateMealTrackingDto) {}
