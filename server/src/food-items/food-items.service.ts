import { Injectable } from '@nestjs/common';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';

@Injectable()
export class FoodItemsService {
  create(createFoodItemDto: CreateFoodItemDto) {
    return 'This action adds a new foodItem';
  }

  findAll() {
    return `This action returns all foodItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} foodItem`;
  }

  update(id: number, updateFoodItemDto: UpdateFoodItemDto) {
    return `This action updates a #${id} foodItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} foodItem`;
  }
}
