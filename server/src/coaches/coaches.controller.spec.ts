import { Test, TestingModule } from '@nestjs/testing';
import { CoachesController } from './coaches.controller';
import { CoachesService } from './coaches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coach } from './entities/coach.entity';

describe('CoachesController', () => {
  let controller: CoachesController;

  const mockCoachRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachesController],
      providers: [
        CoachesService,
        {
          provide: getRepositoryToken(Coach),
          useValue: mockCoachRepository,
        },
      ],
    }).compile();

    controller = module.get<CoachesController>(CoachesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
