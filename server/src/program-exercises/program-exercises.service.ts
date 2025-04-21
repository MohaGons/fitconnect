import { Injectable } from '@nestjs/common';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { UpdateProgramExerciseDto } from './dto/update-program-exercise.dto';

@Injectable()
export class ProgramExercisesService {
  create(createProgramExerciseDto: CreateProgramExerciseDto) {
    return 'This action adds a new programExercise';
  }

  findAll() {
    return `This action returns all programExercises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} programExercise`;
  }

  update(id: number, updateProgramExerciseDto: UpdateProgramExerciseDto) {
    return `This action updates a #${id} programExercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} programExercise`;
  }
}
