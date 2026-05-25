import { Injectable } from '@nestjs/common';
import { CreateSessionExerciseDto } from './dto/create-session-exercise.dto';
import { UpdateSessionExerciseDto } from './dto/update-session-exercise.dto';

@Injectable()
export class SessionExercisesService {
  create(createSessionExerciseDto: CreateSessionExerciseDto) {
    return 'This action adds a new sessionExercise';
  }

  findAll() {
    return `This action returns all sessionExercises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sessionExercise`;
  }

  update(id: number, updateSessionExerciseDto: UpdateSessionExerciseDto) {
    return `This action updates a #${id} sessionExercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} sessionExercise`;
  }
}
