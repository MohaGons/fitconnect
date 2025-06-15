import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@ApiTags('subscriptions')
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
}
