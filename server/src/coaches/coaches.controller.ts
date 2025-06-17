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

@ApiTags('coaches')
@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

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
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachesService.update(+id, updateCoachDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coachesService.remove(+id);
  }
}
