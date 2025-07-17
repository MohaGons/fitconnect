import { Module } from '@nestjs/common';
import { SessionExercisesService } from './session-exercises.service';
import { SessionExercisesController } from './session-exercises.controller';

@Module({
  controllers: [SessionExercisesController],
  providers: [SessionExercisesService],
})
export class SessionExercisesModule {}
