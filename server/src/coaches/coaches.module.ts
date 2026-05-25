import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { Coach } from './entities/coach.entity';
import { KeycloakModule } from '../keycloak/keycloak.module'; // Import du module Keycloak

@Module({
  imports: [TypeOrmModule.forFeature([Coach]), KeycloakModule],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService],
})
export class CoachesModule {}
