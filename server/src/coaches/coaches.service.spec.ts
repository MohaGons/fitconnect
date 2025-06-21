import { Test, TestingModule } from '@nestjs/testing';
import { CoachesService } from './coaches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coach } from './entities/coach.entity';

describe('CoachesService', () => {
  let service: CoachesService;

  const mockCoachRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachesService,
        {
          provide: getRepositoryToken(Coach),
          useValue: mockCoachRepository,
        },
      ],
    }).compile();

    service = module.get<CoachesService>(CoachesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
