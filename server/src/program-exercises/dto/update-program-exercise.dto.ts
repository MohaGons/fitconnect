import { PartialType } from '@nestjs/swagger';
import { CreateProgramExerciseDto } from './create-program-exercise.dto';

export class UpdateProgramExerciseDto extends PartialType(
  CreateProgramExerciseDto,
) {}
