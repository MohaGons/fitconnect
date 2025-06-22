import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CoachesService } from './coaches.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { KeycloakService } from '../keycloak/keycloak.service';

@ApiTags('coaches')
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
  @ApiOperation({ summary: 'Récupérer tous les coachs' })
  @ApiResponse({
    status: 200,
    description: 'Coachs récupérés avec succès',
  })
  findAll() {
    return this.coachesService.findAll();
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