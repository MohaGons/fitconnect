import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { KeycloakModule } from '../keycloak/keycloak.module';

@Module({
  imports: [PassportModule, KeycloakModule],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
