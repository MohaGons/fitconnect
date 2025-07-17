// user-profile.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserProfileService } from './user-profile.service';
import { CompleteRegistrationGuard } from './profile-completion.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user-profile')
export class UserProfileController {
  @Get('check')
  @UseGuards(CompleteRegistrationGuard)
  checkProfileCompletion(@Req() request: Request) {
    //const user = request.user as any;
    return {
      status: 'success',
      message: 'Profil complet.',
      //userId: user?.sub,
    };
  }
  @Get('profile')
  getProfile() {
    return {};
  }
}
