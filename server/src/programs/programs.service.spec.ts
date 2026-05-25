import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsService } from './programs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { ProgramExercise } from '../program-exercises/entities/program-exercise.entity';
import { DataSource } from 'typeorm';

describe('ProgramsService', () => {
  let service: ProgramsService;

  const mockProgramRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockProgramExerciseRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        {
          provide: getRepositoryToken(Program),
          useValue: mockProgramRepository,
        },
        {
          provide: getRepositoryToken(ProgramExercise),
          useValue: mockProgramExerciseRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
