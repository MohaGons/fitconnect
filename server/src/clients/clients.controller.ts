import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { KeycloakService } from '../keycloak/keycloak.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('clients')
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly keycloakService: KeycloakService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau client' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Client créé avec succès',
    type: Client,
  })
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les clients avec filtrage et pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page",
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Terme de recherche',
  })
  @ApiQuery({
    name: 'deleted',
    required: false,
    type: Boolean,
    description: 'Filtre par statut (supprimé ou non)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients récupérés avec succès',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('deleted') deleted?: string,
  ) {
    // Convertir les paramètres string en types appropriés
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const deletedBool = deleted === undefined ? undefined : deleted === 'true';

    console.log('Controller Clients - Paramètres reçus:', {
      page: pageNum,
      limit: limitNum,
      search,
      deleted: deletedBool,
    });

    return this.clientsService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
      deleted: deletedBool,
    });
  }

  @Get('by-user-id/:userId')
  @ApiOperation({ summary: 'Récupérer le client_id par user_id Keycloak' })
  @ApiParam({ name: 'userId', description: "UUID Keycloak de l'utilisateur" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client ID récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        client_id: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client non trouvé pour cet user_id',
  })
  findByUserId(@Param('userId') userId: string) {
    return this.clientsService.findByUserId(userId);
  }

  @Get('profile/:userId')
  @ApiOperation({
    summary: "Récupérer le profil complet d'un client par user_id",
  })
  @ApiParam({ name: 'userId', description: "UUID Keycloak de l'utilisateur" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profil client récupéré avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client non trouvé pour cet user_id',
  })
  getClientProfile(@Param('userId') userId: string) {
    return this.clientsService.getClientProfile(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un client par ID' })
  @ApiParam({ name: 'id', description: 'ID du client' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client récupéré avec succès',
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client non trouvé',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un client' })
  @ApiParam({ name: 'id', description: 'ID du client' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Client mis à jour avec succès',
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client non trouvé',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    // 1. Mettre à jour le client dans la base
    const updatedClient = await this.clientsService.update(id, updateClientDto);

    // 2. Si "deleted" est envoyé et true, on supprime le user dans Keycloak
    if (
      updateClientDto.deleted === true &&
      updatedClient &&
      updatedClient.user_id
    ) {
      await this.keycloakService.deleteUser(updatedClient.user_id);
    }
    // 3. Sinon, on synchronise les infos de base dans Keycloak si besoin
    else if (
      (updateClientDto.firstName ||
        updateClientDto.lastName ||
        updateClientDto.email) &&
      updatedClient &&
      updatedClient.user_id
    ) {
      await this.keycloakService.updateUser(updatedClient.user_id, {
        firstName: updateClientDto.firstName,
        lastName: updateClientDto.lastName,
        email: updateClientDto.email,
      });
    }

    return updatedClient;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un client' })
  @ApiParam({ name: 'id', description: 'ID du client' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Client supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Client non trouvé',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clientsService.remove(id);
  }
}
