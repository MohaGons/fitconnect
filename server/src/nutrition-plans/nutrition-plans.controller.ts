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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NutritionPlansService } from './nutrition-plans.service';
import { CreateNutritionPlanDto } from './dto/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dto/update-nutrition-plan.dto';
import { NutritionPlan } from './entities/nutrition-plan.entity';

interface QueryFilters {
  page?: string;
  limit?: string;
  goal?: string;
  search?: string;
}

@ApiTags('nutrition-plans')
@Controller('nutrition-plans')
export class NutritionPlansController {
  constructor(private readonly nutritionPlansService: NutritionPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau plan nutritionnel' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Plan nutritionnel créé avec succès',
    type: NutritionPlan,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  create(@Body() createNutritionPlanDto: CreateNutritionPlanDto) {
    return this.nutritionPlansService.create(createNutritionPlanDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les plans nutritionnels avec filtres',
  })
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
    name: 'goal',
    required: false,
    description: 'Objectif du plan (weight_loss, weight_gain, etc.)',
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Recherche dans le nom et commentaires',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plans nutritionnels récupérés avec succès',
  })
  async findAll(@Query() query: QueryFilters) {
    const { page, limit, goal, search } = query;
    const filters = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      goal,
      search,
    };
    const { data, total } = await this.nutritionPlansService.findAll(filters);
    return {
      data,
      total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un plan nutritionnel par ID' })
  @ApiParam({ name: 'id', description: 'ID du plan nutritionnel' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan nutritionnel récupéré avec succès',
    type: NutritionPlan,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan nutritionnel non trouvé',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.nutritionPlansService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un plan nutritionnel' })
  @ApiParam({ name: 'id', description: 'ID du plan nutritionnel' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan nutritionnel mis à jour avec succès',
    type: NutritionPlan,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan nutritionnel non trouvé',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNutritionPlanDto: UpdateNutritionPlanDto,
  ) {
    return this.nutritionPlansService.update(id, updateNutritionPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un plan nutritionnel' })
  @ApiParam({ name: 'id', description: 'ID du plan nutritionnel' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Plan nutritionnel supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plan nutritionnel non trouvé',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.nutritionPlansService.remove(id);
  }
}
