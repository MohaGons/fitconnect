import { Module } from '@nestjs/common';
import { RecipeFoodsService } from './recipe-foods.service';
import { RecipeFoodsController } from './recipe-foods.controller';

@Module({
  controllers: [RecipeFoodsController],
  providers: [RecipeFoodsService],
})
export class RecipeFoodsModule {}
