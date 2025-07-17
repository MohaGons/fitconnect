import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { KeycloakModule } from '../keycloak/keycloak.module'; // Import du module Keycloak

@Module({
  imports: [TypeOrmModule.forFeature([Client]), KeycloakModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
