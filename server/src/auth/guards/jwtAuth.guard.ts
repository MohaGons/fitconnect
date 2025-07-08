import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      console.error('❌ JWT Auth Error:', err || info);
      throw err || new UnauthorizedException();
    }
    console.log('✅ Utilisateur autorisé :', user);
    return user;
  }
}
