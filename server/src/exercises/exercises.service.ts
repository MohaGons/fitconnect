import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exercisesRepository.create(createExerciseDto);
    return this.exercisesRepository.save(exercise);
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<{ data: Exercise[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [data, total] = await this.exercisesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByMuscleCategory(
    muscleCategory: string,
    paginationDto?: PaginationDto,
  ): Promise<{ data: Exercise[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [data, total] = await this.exercisesRepository.findAndCount({
      where: { muscle_category: muscleCategory },
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByDifficultyLevel(
    difficultyLevel: string,
    paginationDto?: PaginationDto,
  ): Promise<{ data: Exercise[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [data, total] = await this.exercisesRepository.findAndCount({
      where: { difficulty_level: difficultyLevel },
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({
      where: { exercise_id: id },
      relations: ['program_exercises', 'session_exercises'],
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return exercise;
  }

  async update(
    id: number,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const exercise = await this.findOne(id);
    const updatedExercise = Object.assign(exercise, updateExerciseDto);
    return this.exercisesRepository.save(updatedExercise);
  }

  async remove(id: number): Promise<void> {
    const result = await this.exercisesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
  }
}
