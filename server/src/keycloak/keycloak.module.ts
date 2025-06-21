import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
