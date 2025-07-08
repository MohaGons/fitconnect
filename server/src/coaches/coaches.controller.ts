import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { KeycloakService } from '../keycloak/keycloak.service';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('coaches')
@UseGuards(JwtAuthGuard)
@Controller('coaches')
export class CoachesController {
  constructor(
    private readonly coachesService: CoachesService,
    private readonly keycloakService: KeycloakService // Ajouté ici
  ) {}

  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @Get('by-user-id/:userId')
  @ApiOperation({ summary: 'Récupérer le coach_id par user_id Keycloak' })
  @ApiParam({ name: 'userId', description: "UUID Keycloak de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Coach ID récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        coach_id: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coach non trouvé pour cet user_id',
  })
  findByUserId(@Param('userId') userId: string) {
    return this.coachesService.findByUserId(userId);
  }

  @Get('profile/:userId')
  @ApiOperation({
    summary: "Récupérer le profil complet d'un coach par user_id",
  })
  @ApiParam({ name: 'userId', description: "UUID Keycloak de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Profil coach récupéré avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Coach non trouvé pour cet user_id',
  })
  getCoachProfile(@Param('userId') userId: string) {
    return this.coachesService.getCoachProfile(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les coachs avec filtrage et pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Terme de recherche' })
  @ApiQuery({ name: 'deleted', required: false, type: Boolean, description: 'Filtre par statut (supprimé ou non)' })
  @ApiResponse({
    status: 200,
    description: 'Coachs récupérés avec succès',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('deleted') deleted?: string,
  ): Promise<any> {
    // Convertir les paramètres string en types appropriés
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const deletedBool = deleted === undefined ? undefined : deleted === 'true';
    
    console.log('Controller - Paramètres reçus:', { page: pageNum, limit: limitNum, search, deleted: deletedBool });
    
    return this.coachesService.findAll({
      page: pageNum,
      limit: limitNum,
      search,
      deleted: deletedBool,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coachesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    // 1. Mettre à jour le coach dans la base
    const updatedCoach = await this.coachesService.update(+id, updateCoachDto);

    // 2. Si "deleted" est envoyé et true, on supprime le user dans Keycloak
    if (
      updateCoachDto.deleted === true &&
      updatedCoach &&
      updatedCoach.user_id
    ) {
      await this.keycloakService.deleteUser(updatedCoach.user_id);
    }
    // 3. Sinon, on synchronise les infos de base dans Keycloak si besoin
    else if (
      (updateCoachDto.firstName || updateCoachDto.lastName || updateCoachDto.email) &&
      updatedCoach &&
      updatedCoach.user_id
    ) {
      await this.keycloakService.updateUser(updatedCoach.user_id, {
        firstName: updateCoachDto.firstName,
        lastName: updateCoachDto.lastName,
        email: updateCoachDto.email,
      });
    }

    return updatedCoach;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coachesService.remove(+id);
  }
}