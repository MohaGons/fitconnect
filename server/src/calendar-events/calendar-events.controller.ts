import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CalendarEventsService } from './calendar-events.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { ScheduleSessionDto } from './dto/schedule-session.dto';
import { ScheduleMealDto } from './dto/schedule-meal.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { Client } from '../clients/entities/client.entity';
import { Program } from '../programs/entities/program.entity';
import { Meal } from '../meals/entities/meal.entity';

@ApiTags('calendar-events')
@Controller('calendar-events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel événement calendrier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Événement créé avec succès',
    type: CalendarEvent,
  })
  create(
    @Body() createCalendarEventDto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return this.calendarEventsService.create(createCalendarEventDto);
  }

  // ✅ ROUTES SPÉCIALISÉES AVANT LES ROUTES GÉNÉRIQUES

  @Post('schedule/session')
  @ApiOperation({
    summary: "Planifier une séance à partir d'un programme existant",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Séance planifiée avec succès',
    type: CalendarEvent,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programme ou client non trouvé',
  })
  async scheduleSession(
    @Body() scheduleSessionDto: ScheduleSessionDto,
  ): Promise<CalendarEvent> {
    // Récupérer le programme pour obtenir les informations
    const program = await this.calendarEventsService.getProgram(
      scheduleSessionDto.program_id,
    );
    if (!program) {
      throw new NotFoundException('Programme non trouvé');
    }

    // Créer l'événement avec les données du programme
    const createEventDto: CreateCalendarEventDto = {
      coach_id: scheduleSessionDto.coach_id,
      client_id: scheduleSessionDto.client_id,
      title: program.name,
      type: 'session',
      start_datetime: new Date(scheduleSessionDto.start_datetime),
      end_datetime: scheduleSessionDto.end_datetime
        ? new Date(scheduleSessionDto.end_datetime)
        : undefined,
      status: scheduleSessionDto.status || 'planned',
      coach_notes: scheduleSessionDto.coach_notes,
      session_type: program.category,
      duration: scheduleSessionDto.duration,
      program_id: scheduleSessionDto.program_id,
    };

    return this.calendarEventsService.create(createEventDto);
  }

  @Post('schedule/meal')
  @ApiOperation({ summary: "Planifier un repas à partir d'un repas existant" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Repas planifié avec succès',
    type: CalendarEvent,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Repas ou client non trouvé',
  })
  async scheduleMeal(
    @Body() scheduleMealDto: ScheduleMealDto,
  ): Promise<CalendarEvent> {
    // Récupérer le repas pour obtenir les informations
    const meal = await this.calendarEventsService.getMeal(
      scheduleMealDto.meal_id,
    );
    if (!meal) {
      throw new NotFoundException('Repas non trouvé');
    }

    // Créer l'événement avec les données du repas
    const createEventDto: CreateCalendarEventDto = {
      coach_id: scheduleMealDto.coach_id,
      client_id: scheduleMealDto.client_id,
      title: meal.name,
      type: 'meal',
      start_datetime: new Date(scheduleMealDto.start_datetime),
      end_datetime: scheduleMealDto.end_datetime
        ? new Date(scheduleMealDto.end_datetime)
        : undefined,
      status: scheduleMealDto.status || 'planned',
      coach_notes: scheduleMealDto.coach_notes,
      meal_type: meal.meal_type,
      calories: meal.calories,
      meal_id: scheduleMealDto.meal_id,
    };

    return this.calendarEventsService.create(createEventDto);
  }

  @Get('coach/:coachId')
  @ApiOperation({ summary: "Récupérer tous les événements d'un coach" })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Date de début pour filtrer (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Date de fin pour filtrer (ISO string)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Événements récupérés avec succès',
    type: [CalendarEvent],
  })
  findByCoach(
    @Param('coachId', ParseIntPipe) coachId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CalendarEvent[]> {
    if (startDate && endDate) {
      return this.calendarEventsService.findEventsByCoachAndDateRange(
        coachId,
        new Date(startDate),
        new Date(endDate),
      );
    }
    return this.calendarEventsService.findAllByCoach(coachId);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: "Récupérer tous les événements d'un client" })
  @ApiParam({ name: 'clientId', description: 'ID du client' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Date de début pour filtrer (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Date de fin pour filtrer (ISO string)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Événements récupérés avec succès',
    type: [CalendarEvent],
  })
  findByClient(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CalendarEvent[]> {
    if (startDate && endDate) {
      return this.calendarEventsService.findEventsByClientAndDateRange(
        clientId,
        new Date(startDate),
        new Date(endDate),
      );
    }
    return this.calendarEventsService.findAllByClient(clientId);
  }

  @Get('coach/:coachId/clients')
  @ApiOperation({
    summary: "Récupérer la liste des clients d'un coach (via subscriptions)",
  })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Inclure les clients avec subscriptions inactives',
    type: Boolean,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients récupérés avec succès',
    type: [Client],
  })
  getCoachClients(
    @Param('coachId', ParseIntPipe) coachId: number,
    @Query('includeInactive') includeInactive?: boolean,
  ): Promise<Client[]> {
    if (includeInactive) {
      return this.calendarEventsService.getAllCoachClients(coachId);
    }
    return this.calendarEventsService.getCoachClients(coachId);
  }

  @Get('coach/:coachId/clients-with-subscription')
  @ApiOperation({
    summary:
      "Récupérer les clients d'un coach avec informations de subscription",
  })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Clients avec informations de subscription récupérés avec succès',
  })
  getCoachClientsWithSubscriptionInfo(
    @Param('coachId', ParseIntPipe) coachId: number,
  ): Promise<any[]> {
    return this.calendarEventsService.getCoachClientsWithSubscriptionInfo(
      coachId,
    );
  }

  @Get('available-programs/coach/:coachId')
  @ApiOperation({
    summary: 'Récupérer les programmes disponibles pour un coach',
  })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programmes récupérés avec succès',
    type: [Program],
  })
  async getAvailablePrograms(
    @Param('coachId', ParseIntPipe) coachId: number,
  ): Promise<Program[]> {
    return this.calendarEventsService.getAvailablePrograms(coachId);
  }

  @Get('available-meals')
  @ApiOperation({ summary: 'Récupérer les repas disponibles' })
  @ApiQuery({
    name: 'coachId',
    required: false,
    description: 'ID du coach pour filtrer par nutrition plan',
    type: Number,
  })
  @ApiQuery({
    name: 'planId',
    required: false,
    description: 'ID du plan nutritionnel pour filtrer',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repas récupérés avec succès',
    type: [Meal],
  })
  async getAvailableMeals(
    @Query('coachId') coachId?: string,
    @Query('planId') planId?: string,
  ) {
    // Validation manuelle des paramètres
    let parsedCoachId: number | undefined;
    let parsedPlanId: number | undefined;

    if (coachId) {
      parsedCoachId = parseInt(coachId, 10);
      if (isNaN(parsedCoachId) || parsedCoachId < 1) {
        throw new BadRequestException('coachId must be a positive number');
      }
    }

    if (planId) {
      parsedPlanId = parseInt(planId, 10);
      if (isNaN(parsedPlanId) || parsedPlanId < 1) {
        throw new BadRequestException('planId must be a positive number');
      }
    }
    return this.calendarEventsService.getAvailableMeals(
      parsedCoachId,
      parsedPlanId,
    );
  }

  // ✅ ROUTES GÉNÉRIQUES À LA FIN

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement par ID' })
  @ApiParam({ name: 'id', description: "ID de l'événement" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Événement récupéré avec succès',
    type: CalendarEvent,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Événement non trouvé',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CalendarEvent> {
    return this.calendarEventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un événement' })
  @ApiParam({ name: 'id', description: "ID de l'événement" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Événement mis à jour avec succès',
    type: CalendarEvent,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Événement non trouvé',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalendarEventDto: UpdateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return this.calendarEventsService.update(id, updateCalendarEventDto);
  }

  @Patch(':id/client-notes')
  @ApiOperation({
    summary: 'Mettre à jour les notes du client pour un événement',
  })
  @ApiParam({ name: 'id', description: "ID de l'événement" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notes du client mises à jour avec succès',
    type: CalendarEvent,
  })
  updateClientNotes(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { client_notes: string },
  ): Promise<CalendarEvent> {
    return this.calendarEventsService.updateClientNotes(id, body.client_notes);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un événement' })
  @ApiParam({ name: 'id', description: "ID de l'événement" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Événement supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Événement non trouvé',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.calendarEventsService.remove(id);
  }
}
