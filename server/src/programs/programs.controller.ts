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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Program } from './entities/program.entity';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau programme' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Le programme a été créé avec succès',
    type: Program,
  })
  create(@Body() createProgramDto: CreateProgramDto): Promise<Program> {
    return this.programsService.create(createProgramDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les programmes avec pagination' })
  @ApiQuery({
    name: 'coach_id',
    required: false,
    description: 'Filtrer par ID du coach',
    type: Number,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrer par catégorie',
  })
  @ApiQuery({
    name: 'difficulty_level',
    required: false,
    description: 'Filtrer par niveau de difficulté',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page (commence à 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre d'éléments par page",
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des programmes récupérée avec succès avec pagination',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Program' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('coach_id') coachId?: string,
    @Query('category') category?: string,
    @Query('difficulty_level') difficultyLevel?: string,
  ) {
    if (coachId) {
      return this.programsService.findByCoach(+coachId, paginationDto);
    }

    if (category) {
      return this.programsService.findByCategory(category, paginationDto);
    }

    if (difficultyLevel) {
      return this.programsService.findByDifficultyLevel(
        difficultyLevel,
        paginationDto,
      );
    }

    return this.programsService.findAll(paginationDto);
  }

  @Get('coach/:coachId')
  @ApiOperation({ summary: "Récupérer les programmes d'un coach spécifique" })
  @ApiParam({ name: 'coachId', description: 'ID du coach' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programmes du coach récupérés avec succès',
  })
  findByCoach(
    @Param('coachId') coachId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.programsService.findByCoach(+coachId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un programme par id' })
  @ApiParam({ name: 'id', description: 'ID du programme' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programme récupéré avec succès',
    type: Program,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programme non trouvé',
  })
  findOne(@Param('id') id: string): Promise<Program> {
    return this.programsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un programme' })
  @ApiParam({ name: 'id', description: 'ID du programme' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programme mis à jour avec succès',
    type: Program,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programme non trouvé',
  })
  update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ): Promise<Program> {
    return this.programsService.update(+id, updateProgramDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un programme' })
  @ApiParam({ name: 'id', description: 'ID du programme' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Programme supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programme non trouvé',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.programsService.remove(+id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Dupliquer un programme existant' })
  @ApiParam({ name: 'id', description: 'ID du programme à dupliquer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Programme dupliqué avec succès',
    type: Program,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programme source non trouvé',
  })
  duplicate(
    @Param('id') id: string,
    @Body() body: { name: string; coach_id: number },
  ): Promise<Program> {
    return this.programsService.duplicate(+id, body.name, body.coach_id);
  }
}
