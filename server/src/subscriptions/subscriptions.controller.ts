import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CreateCoachingRequestDto } from './dto/create-coaching-request.dto';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';
import { Subscription } from './entities/subscription.entity';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('subscriptions')
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription créée avec succès',
    type: Subscription,
  })
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les subscriptions' })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions récupérées avec succès',
    type: [Subscription],
  })
  findAll(): Promise<Subscription[]> {
    return this.subscriptionsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer toutes les subscriptions actives' })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions actives récupérées avec succès',
    type: [Subscription],
  })
  findActiveSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionsService.findActiveSubscriptions();
  }

  @Get('coach/:coachId')
  @ApiOperation({ summary: "Récupérer les subscriptions d'un coach" })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions du coach récupérées avec succès',
    type: [Subscription],
  })
  findByCoach(
    @Param('coachId', ParseIntPipe) coachId: number,
  ): Promise<Subscription[]> {
    return this.subscriptionsService.findByCoach(coachId);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: "Récupérer les subscriptions d'un client" })
  @ApiParam({ name: 'clientId', description: 'ID du client' })
  @ApiResponse({
    status: 200,
    description: 'Subscriptions du client récupérées avec succès',
    type: [Subscription],
  })
  findByClient(
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<Subscription[]> {
    return this.subscriptionsService.findByClient(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une subscription par ID' })
  @ApiParam({ name: 'id', description: 'ID de la subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription récupérée avec succès',
    type: Subscription,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Subscription> {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une subscription' })
  @ApiParam({ name: 'id', description: 'ID de la subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription mise à jour avec succès',
    type: Subscription,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Patch(':id/expire')
  @ApiOperation({ summary: 'Expirer une subscription' })
  @ApiParam({ name: 'id', description: 'ID de la subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription expirée avec succès',
    type: Subscription,
  })
  expireSubscription(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Subscription> {
    return this.subscriptionsService.expireSubscription(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une subscription' })
  @ApiParam({ name: 'id', description: 'ID de la subscription' })
  @ApiResponse({
    status: 204,
    description: 'Subscription supprimée avec succès',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.subscriptionsService.remove(id);
  }

  // Nouveaux endpoints pour les demandes de coaching
  @Post('coaching-request')
  @ApiOperation({
    summary: 'Créer une demande de coaching (client vers coach)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Demande de coaching créée avec succès',
    type: Subscription,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Demande déjà existante ou coach inactif',
  })
  createCoachingRequest(
    @Body() createCoachingRequestDto: CreateCoachingRequestDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.createCoachingRequest(
      createCoachingRequestDto,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Accepter ou refuser une demande de coaching' })
  @ApiParam({ name: 'id', description: 'ID de la demande' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut de la demande mis à jour avec succès',
    type: Subscription,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Demande non modifiable ou données manquantes',
  })
  updateSubscriptionStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateSubscriptionStatusDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.updateSubscriptionStatus(
      id,
      updateStatusDto,
    );
  }

  @Get('coach/:coachId/pending-requests')
  @ApiOperation({ summary: 'Récupérer les demandes en attente pour un coach' })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Demandes en attente récupérées avec succès',
    type: [Subscription],
  })
  getPendingRequestsByCoach(
    @Param('coachId', ParseIntPipe) coachId: number,
  ): Promise<Subscription[]> {
    return this.subscriptionsService.getPendingRequestsByCoach(coachId);
  }

  @Get('coach/:coachId/active-clients')
  @ApiOperation({ summary: 'Récupérer les clients actifs pour un coach' })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients actifs récupérés avec succès',
    type: [Subscription],
  })
  getActiveClientsByCoach(
    @Param('coachId', ParseIntPipe) coachId: number,
  ): Promise<Subscription[]> {
    return this.subscriptionsService.getActiveClientsByCoach(coachId);
  }

  @Get('client/:clientId/active-coach')
  @ApiOperation({ summary: 'Récupérer le coach actif pour un client' })
  @ApiParam({ name: 'clientId', description: 'ID du client' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coach actif récupéré avec succès',
    type: Subscription,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Aucun coach actif trouvé pour ce client',
  })
  getActiveCoachByClient(
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<Subscription | null> {
    return this.subscriptionsService.getActiveCoachByClient(clientId);
  }

  @Get('client/:clientId/requests')
  @ApiOperation({ summary: "Récupérer toutes les demandes d'un client" })
  @ApiParam({ name: 'clientId', description: 'ID du client' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Demandes du client récupérées avec succès',
    type: [Subscription],
  })
  getClientRequests(
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<Subscription[]> {
    return this.subscriptionsService.getClientRequests(clientId);
  }
}
