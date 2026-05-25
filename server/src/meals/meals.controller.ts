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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './entities/meal.entity';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

interface QueryFilters {
  page?: string;
  limit?: string;
  plan_id?: string;
  meal_type?: string;
  search?: string;
}

@ApiTags('meals')
@UseGuards(JwtAuthGuard)
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau repas' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Repas créé avec succès',
    type: Meal,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  create(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.create(createMealDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les repas avec filtres' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre d'éléments par page",
    type: Number,
  })
  @ApiQuery({
    name: 'plan_id',
    required: false,
    description: 'ID du plan nutritionnel (ou "null" pour repas sans plan)',
    type: String,
  })
  @ApiQuery({
    name: 'meal_type',
    required: false,
    description: 'Type de repas (breakfast, lunch, dinner, etc.)',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche dans le nom et instructions',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repas récupérés avec succès',
  })
  async findAll(@Query() query: QueryFilters) {
    const { page, limit, plan_id, meal_type, search } = query;
    const filters = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      plan_id:
        plan_id === 'null' ? null : plan_id ? parseInt(plan_id, 10) : undefined,
      meal_type,
      search,
    };
    const { data, total } = await this.mealsService.findAll(filters);
    return {
      data,
      total,
    };
  }

  @Get('by-plan/:planId')
  @ApiOperation({
    summary: "Récupérer les repas d'un plan nutritionnel spécifique",
  })
  @ApiParam({ name: 'planId', description: 'ID du plan nutritionnel' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repas du plan récupérés avec succès',
    type: [Meal],
  })
  findByPlanId(@Param('planId', ParseIntPipe) planId: number) {
    return this.mealsService.findByPlanId(planId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un repas par ID' })
  @ApiParam({ name: 'id', description: 'ID du repas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repas récupéré avec succès',
    type: Meal,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Repas non trouvé',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mealsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un repas' })
  @ApiParam({ name: 'id', description: 'ID du repas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Repas mis à jour avec succès',
    type: Meal,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Repas non trouvé',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealDto: UpdateMealDto,
  ) {
    return this.mealsService.update(id, updateMealDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un repas' })
  @ApiParam({ name: 'id', description: 'ID du repas' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Repas supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Repas non trouvé',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mealsService.remove(id);
  }
}
