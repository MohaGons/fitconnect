import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { Client } from '../clients/entities/client.entity';
import { Coach } from '../coaches/entities/coach.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscriptions/entities/subscription.entity';
import { Program } from '../programs/entities/program.entity';
import { Meal } from '../meals/entities/meal.entity';

@Injectable()
export class CalendarEventsService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarEventRepository: Repository<CalendarEvent>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async create(
    createCalendarEventDto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    // Vérifier que le coach existe
    const coach = await this.coachRepository.findOne({
      where: { coach_id: createCalendarEventDto.coach_id },
    });
    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    // Vérifier que le client existe
    const client = await this.clientRepository.findOne({
      where: { client_id: createCalendarEventDto.client_id },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Vérifier qu'il existe une subscription active entre le coach et le client
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        coach_id: createCalendarEventDto.coach_id,
        client_id: createCalendarEventDto.client_id,
        status: SubscriptionStatus.ACTIVE,
      },
    });
    if (!subscription) {
      throw new NotFoundException(
        'No active subscription found between this coach and client',
      );
    }

    // Convert string dates to Date objects
    const eventData = {
      ...createCalendarEventDto,
      start_datetime: new Date(createCalendarEventDto.start_datetime),
      end_datetime: createCalendarEventDto.end_datetime
        ? new Date(createCalendarEventDto.end_datetime)
        : undefined,
    };

    const calendarEvent = this.calendarEventRepository.create(eventData);
    return this.calendarEventRepository.save(calendarEvent);
  }

  async findAllByCoach(coachId: number): Promise<CalendarEvent[]> {
    return this.calendarEventRepository.find({
      where: { coach_id: coachId },
      relations: ['client'],
      order: { start_datetime: 'ASC' },
    });
  }

  async findAllByClient(clientId: number): Promise<CalendarEvent[]> {
    return this.calendarEventRepository.find({
      where: { client_id: clientId },
      relations: ['coach'],
      order: { start_datetime: 'ASC' },
    });
  }

  async findEventsByCoachAndDateRange(
    coachId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEvent[]> {
    return this.calendarEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.client', 'client')
      .where('event.coach_id = :coachId', { coachId })
      .andWhere('event.start_datetime >= :startDate', { startDate })
      .andWhere('event.start_datetime <= :endDate', { endDate })
      .orderBy('event.start_datetime', 'ASC')
      .getMany();
  }

  async findEventsByClientAndDateRange(
    clientId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<CalendarEvent[]> {
    return this.calendarEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.coach', 'coach')
      .where('event.client_id = :clientId', { clientId })
      .andWhere('event.start_datetime >= :startDate', { startDate })
      .andWhere('event.start_datetime <= :endDate', { endDate })
      .orderBy('event.start_datetime', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<CalendarEvent> {
    const event = await this.calendarEventRepository.findOne({
      where: { event_id: id },
      relations: ['coach', 'client', 'program'],
    });

    if (!event) {
      throw new NotFoundException(`Calendar event with id ${id} not found`);
    }

    return event;
  }

  async update(
    id: number,
    updateCalendarEventDto: UpdateCalendarEventDto,
    userRole?: string,
  ): Promise<CalendarEvent> {
    const event = await this.findOne(id);

    if (userRole === 'CLIENT') {
      const updateData: Partial<UpdateCalendarEventDto> = {};

      if (updateCalendarEventDto.client_notes !== undefined) {
        updateData.client_notes = updateCalendarEventDto.client_notes;
      }

      if (Object.keys(updateData).length === 0) {
        throw new ForbiddenException('Clients can only update their notes');
      }

      Object.assign(event, updateData);
    } else {
      const updateData: UpdateCalendarEventDto = { ...updateCalendarEventDto };
      if (updateData.start_datetime) {
        updateData.start_datetime = new Date(
          updateData.start_datetime,
        ).toISOString();
      }
      if (updateData.end_datetime) {
        updateData.end_datetime = new Date(
          updateData.end_datetime,
        ).toISOString();
      }

      Object.assign(event, updateData);
    }

    return this.calendarEventRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const result = await this.calendarEventRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Calendar event with id ${id} not found`);
    }
  }

  async updateClientNotes(
    id: number,
    clientNotes: string,
  ): Promise<CalendarEvent> {
    const event = await this.findOne(id);
    event.client_notes = clientNotes;
    return this.calendarEventRepository.save(event);
  }

  async getCoachClients(coachId: number): Promise<Client[]> {
    const clients = await this.clientRepository
      .createQueryBuilder('client')
      .innerJoin(
        'subscriptions',
        'subscription',
        'subscription.client_id = client.client_id',
      )
      .where('subscription.coach_id = :coachId', { coachId })
      .andWhere('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .select([
        'client.client_id',
        'client.user_id',
        'client.firstName',
        'client.lastName',
        'client.email',
      ])
      .distinctOn(['client.client_id'])
      .getMany();

    return clients;
  }

  async getCoachClientsWithSubscriptionInfo(coachId: number): Promise<any[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: {
        coach_id: coachId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['client'],
      order: { start_date: 'DESC' },
    });

    return subscriptions.map((sub) => ({
      client_id: sub.client.client_id,
      user_id: sub.client.user_id,
      firstName: sub.client.firstName,
      lastName: sub.client.lastName,
      email: sub.client.email,
      subscription_type: sub.subscription_type,
      subscription_status: sub.status,
      start_date: sub.start_date,
      end_date: sub.end_date,
      amount: sub.amount,
    }));
  }

  async getAllCoachClients(coachId: number): Promise<Client[]> {
    const clients = await this.clientRepository
      .createQueryBuilder('client')
      .innerJoin(
        'subscriptions',
        'subscription',
        'subscription.client_id = client.client_id',
      )
      .where('subscription.coach_id = :coachId', { coachId })
      .select([
        'client.client_id',
        'client.user_id',
        'client.firstName',
        'client.lastName',
        'client.email',
      ])
      .distinctOn(['client.client_id'])
      .getMany();

    return clients;
  }

  async getAvailablePrograms(coachId: number): Promise<Program[]> {
    return this.programRepository.find({
      where: { coach_id: coachId },
      relations: ['program_exercises'],
    });
  }

  async getAvailableMeals(coachId?: number, planId?: number): Promise<Meal[]> {
    const queryBuilder = this.mealRepository.createQueryBuilder('meal');

    if (coachId) {
      queryBuilder
        .leftJoin('meal.nutrition_plan', 'nutrition_plan')
        .where('nutrition_plan.coach_id = :coachId', { coachId });
    }

    if (planId) {
      queryBuilder.andWhere('meal.plan_id = :planId', { planId });
    }

    return queryBuilder.getMany();
  }

  async getProgram(programId: number): Promise<Program | null> {
    return this.programRepository.findOne({
      where: { program_id: programId },
      relations: ['program_exercises'],
    });
  }

  async getMeal(mealId: number): Promise<Meal | null> {
    return this.mealRepository.findOne({
      where: { meal_id: mealId },
      relations: ['nutrition_plan'],
    });
  }
}
