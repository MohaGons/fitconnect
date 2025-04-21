import { PartialType } from '@nestjs/swagger';
import { CreateMealScheduleDto } from './create-meal-schedule.dto';

export class UpdateMealScheduleDto extends PartialType(CreateMealScheduleDto) {}
