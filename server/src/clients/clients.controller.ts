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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

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
  @ApiOperation({ summary: 'Récupérer tous les clients' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clients récupérés avec succès',
    type: [Client],
  })
  findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update(id, updateClientDto);
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
