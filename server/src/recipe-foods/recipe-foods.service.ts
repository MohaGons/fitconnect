import { Injectable } from '@nestjs/common';
import { CreateRecipeFoodDto } from './dto/create-recipe-food.dto';
import { UpdateRecipeFoodDto } from './dto/update-recipe-food.dto';

@Injectable()
export class RecipeFoodsService {
  create(createRecipeFoodDto: CreateRecipeFoodDto) {
    return 'This action adds a new recipeFood';
  }

  findAll() {
    return `This action returns all recipeFoods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipeFood`;
  }

  update(id: number, updateRecipeFoodDto: UpdateRecipeFoodDto) {
    return `This action updates a #${id} recipeFood`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipeFood`;
  }
}
