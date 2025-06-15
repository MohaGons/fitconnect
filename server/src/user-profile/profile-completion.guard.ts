import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserProfileService } from './user-profile.service';
import { Request, Response } from 'express';

@Injectable()
export class CompleteRegistrationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userProfileService: UserProfileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const user = request as any;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    const userId = user.sub; // Keycloak met l'id du user dans sub

    // Vérifie s'il est déjà Coach ou Client
    const isCompleted =
      await this.userProfileService.isProfileCompleted(userId);

    if (!isCompleted) {
      // Si pas complété ➔ redirection vers page de complétion
      response.redirect('/complete-registration');
      return false;
    }

    return true;
  }
}
