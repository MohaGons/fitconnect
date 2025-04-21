import { PartialType } from '@nestjs/swagger';
import { CreateSessionExerciseDto } from './create-session-exercise.dto';

export class UpdateSessionExerciseDto extends PartialType(
  CreateSessionExerciseDto,
) {}
