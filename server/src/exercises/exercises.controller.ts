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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Exercise } from './entities/exercise.entity';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@ApiTags('exercises')
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  ///@ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel exercice' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "L'exercice a été créé avec succès",
    type: Exercise,
  })
  create(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les exercices avec pagination' })
  @ApiQuery({
    name: 'muscle_category',
    required: false,
    description: 'Filtrer par catégorie de muscle',
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
    description: 'Liste des exercices récupérée avec succès avec pagination',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Exercise' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('muscle_category') muscleCategory?: string,
    @Query('difficulty_level') difficultyLevel?: string,
  ) {
    if (muscleCategory) {
      return this.exercisesService.findByMuscleCategory(
        muscleCategory,
        paginationDto,
      );
    }

    if (difficultyLevel) {
      return this.exercisesService.findByDifficultyLevel(
        difficultyLevel,
        paginationDto,
      );
    }

    return this.exercisesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un exercice par id' })
  @ApiParam({ name: 'id', description: "ID de l'exercice" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exercice récupéré avec succès',
    type: Exercise,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Exercice non trouvé',
  })
  findOne(@Param('id') id: string): Promise<Exercise> {
    return this.exercisesService.findOne(+id);
  }

  @Patch(':id')
  //@UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un exercice' })
  @ApiParam({ name: 'id', description: "ID de l'exercice" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exercice mis à jour avec succès',
    type: Exercise,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Exercice non trouvé',
  })
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exercisesService.update(+id, updateExerciseDto);
  }

  @Delete(':id')
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un exercice' })
  @ApiParam({ name: 'id', description: "ID de l'exercice" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Exercice supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Exercice non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.exercisesService.remove(+id);
  }
}
