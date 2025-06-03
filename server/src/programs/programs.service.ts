import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Program } from './entities/program.entity';
import { ProgramExercise } from '../program-exercises/entities/program-exercise.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private programsRepository: Repository<Program>,
    @InjectRepository(ProgramExercise)
    private programExercisesRepository: Repository<ProgramExercise>,
    private dataSource: DataSource,
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<Program> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Créer le programme d'abord
      const programData = {
        coach_id: createProgramDto.coach_id,
        name: createProgramDto.name,
        description: createProgramDto.description,
        difficulty_level: createProgramDto.difficulty_level,
        category: createProgramDto.category,
      };

      const program = queryRunner.manager.create(Program, programData);
      const savedProgram = await queryRunner.manager.save(program);

      // Créer les exercices du programme
      if (createProgramDto.exercises && createProgramDto.exercises.length > 0) {
        const programExercises = createProgramDto.exercises.map((exerciseDto) =>
          queryRunner.manager.create(ProgramExercise, {
            program_id: savedProgram.program_id,
            exercise_id: exerciseDto.exercise_id,
            order_number: exerciseDto.order_number,
            sets: exerciseDto.sets,
            repetitions: exerciseDto.repetitions,
            recommended_weight: exerciseDto.recommended_weight,
            duration_seconds: exerciseDto.duration_seconds,
            rest_seconds: exerciseDto.rest_seconds,
            instructions: exerciseDto.instructions,
          }),
        );

        await queryRunner.manager.save(programExercises);
      }

      await queryRunner.commitTransaction();

      // Retourner le programme avec ses exercices
      return this.findOne(savedProgram.program_id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<{ data: Program[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [data, total] = await this.programsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { creation_date: 'DESC' },
      relations: ['coach', 'program_exercises', 'program_exercises.exercise'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByCoach(
    coachId: number,
    paginationDto?: PaginationDto,
  ): Promise<{ data: Program[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [data, total] = await this.programsRepository.findAndCount({
      where: { coach_id: coachId },
      skip: (page - 1) * limit,
      take: limit,
      order: { creation_date: 'DESC' },
      relations: ['coach', 'program_exercises', 'program_exercises.exercise'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByCategory(
    category: string,
    paginationDto?: PaginationDto,
  ): Promise<{ data: Program[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [data, total] = await this.programsRepository.findAndCount({
      where: { category },
      skip: (page - 1) * limit,
      take: limit,
      order: { creation_date: 'DESC' },
      relations: ['coach', 'program_exercises', 'program_exercises.exercise'],
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
  ): Promise<{ data: Program[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};

    const [data, total] = await this.programsRepository.findAndCount({
      where: { difficulty_level: difficultyLevel },
      skip: (page - 1) * limit,
      take: limit,
      order: { creation_date: 'DESC' },
      relations: ['coach', 'program_exercises', 'program_exercises.exercise'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Program> {
    const program = await this.programsRepository.findOne({
      where: { program_id: id },
      relations: ['coach', 'program_exercises', 'program_exercises.exercise'],
      order: {
        program_exercises: {
          order_number: 'ASC',
        },
      },
    });

    if (!program) {
      throw new NotFoundException(`Program with id ${id} not found`);
    }

    return program;
  }

  async update(
    id: number,
    updateProgramDto: UpdateProgramDto,
  ): Promise<Program> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const program = await this.findOne(id);

      // Mettre à jour les données du programme
      const programData = {
        coach_id: updateProgramDto.coach_id,
        name: updateProgramDto.name,
        description: updateProgramDto.description,
        difficulty_level: updateProgramDto.difficulty_level,
        category: updateProgramDto.category,
      };

      await queryRunner.manager.update(Program, id, programData);

      // Si des exercices sont fournis, les mettre à jour
      if (updateProgramDto.exercises) {
        // Supprimer les anciens exercices du programme
        await queryRunner.manager.delete(ProgramExercise, { program_id: id });

        // Créer les nouveaux exercices
        if (updateProgramDto.exercises.length > 0) {
          const programExercises = updateProgramDto.exercises.map(
            (exerciseDto) =>
              queryRunner.manager.create(ProgramExercise, {
                program_id: id,
                exercise_id: exerciseDto.exercise_id,
                order_number: exerciseDto.order_number,
                sets: exerciseDto.sets,
                repetitions: exerciseDto.repetitions,
                recommended_weight: exerciseDto.recommended_weight,
                duration_seconds: exerciseDto.duration_seconds,
                rest_seconds: exerciseDto.rest_seconds,
                instructions: exerciseDto.instructions,
              }),
          );

          await queryRunner.manager.save(programExercises);
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Vérifier que le programme existe
      const program = await this.programsRepository.findOne({
        where: { program_id: id },
      });

      if (!program) {
        throw new NotFoundException(`Program with id ${id} not found`);
      }

      // Supprimer d'abord les exercices du programme (pour éviter la contrainte de clé étrangère)
      await queryRunner.manager.delete(ProgramExercise, { program_id: id });

      // Puis supprimer le programme
      await queryRunner.manager.delete(Program, { program_id: id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async duplicate(
    id: number,
    newName: string,
    coachId: number,
  ): Promise<Program> {
    const originalProgram = await this.findOne(id);

    const duplicateData: CreateProgramDto = {
      coach_id: coachId,
      name: newName,
      description: originalProgram.description,
      difficulty_level: originalProgram.difficulty_level,
      category: originalProgram.category,
      exercises: originalProgram.program_exercises.map((pe) => ({
        exercise_id: pe.exercise_id,
        order_number: pe.order_number,
        sets: pe.sets,
        repetitions: pe.repetitions,
        recommended_weight: pe.recommended_weight,
        duration_seconds: pe.duration_seconds,
        rest_seconds: pe.rest_seconds,
        instructions: pe.instructions,
      })),
    };

    return this.create(duplicateData);
  }
}
