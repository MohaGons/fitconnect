import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecipeFoodsService } from './recipe-foods.service';
import { CreateRecipeFoodDto } from './dto/create-recipe-food.dto';
import { UpdateRecipeFoodDto } from './dto/update-recipe-food.dto';

@Controller('recipe-foods')
export class RecipeFoodsController {
  constructor(private readonly recipeFoodsService: RecipeFoodsService) {}

  @Post()
  create(@Body() createRecipeFoodDto: CreateRecipeFoodDto) {
    return this.recipeFoodsService.create(createRecipeFoodDto);
  }

  @Get()
  findAll() {
    return this.recipeFoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeFoodsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipeFoodDto: UpdateRecipeFoodDto,
  ) {
    return this.recipeFoodsService.update(+id, updateRecipeFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeFoodsService.remove(+id);
  }
}
