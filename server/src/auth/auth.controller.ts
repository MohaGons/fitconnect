import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KeycloakService } from '../keycloak/keycloak.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @Post('choose-role')
  //@UseGuards(AuthGuard('jwt'))
  async chooseRole(@Body() body: { role: string }, @Headers() headers: any) {
    const token = headers.authorization?.split(' ')[1];
    const userId = await this.keycloakService.getUserIdFromToken(token);

    if (!userId) {
      throw new Error('User ID not found in token');
    }

    if (body.role === 'COACH') {
      await this.keycloakService.assignCoachRole(userId);
      return { message: 'Role COACH assigned successfully' };
    } else if (body.role === 'CLIENT') {
      await this.keycloakService.assignClientRole(userId);
      return { message: 'Role CLIENT assigned successfully' };
    }

    throw new Error('Invalid role');
  }
}
