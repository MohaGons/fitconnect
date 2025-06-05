import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';

interface QueryFilters {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
}

@Controller('food-items')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Post()
  create(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemsService.create(createFoodItemDto);
  }

  @Get()
  async findAll(@Query() query: QueryFilters) {
    const { page, limit, category, search } = query;
    const filters = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      category,
      search,
    };
    const result = await this.foodItemsService.findAll(filters);
    return {
      data: result.data,
      total: result.total,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.foodItemsService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFoodItemDto: UpdateFoodItemDto,
  ) {
    return this.foodItemsService.update(+id, updateFoodItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodItemsService.remove(+id);
  }
}
