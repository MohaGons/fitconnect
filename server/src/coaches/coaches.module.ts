import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { Coach } from './entities/coach.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coach])],
  controllers: [CoachesController],
  providers: [CoachesService],
})
export class CoachesModule {}
