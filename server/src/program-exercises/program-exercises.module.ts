import { Module } from '@nestjs/common';
import { ProgramExercisesService } from './program-exercises.service';
import { ProgramExercisesController } from './program-exercises.controller';

@Module({
  controllers: [ProgramExercisesController],
  providers: [ProgramExercisesService],
})
export class ProgramExercisesModule {}
