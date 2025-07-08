import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('✅ JwtStrategy initialisée');
    super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    algorithms: ['RS256'],
    issuer: 'http://localhost:8081/realms/MY-REALM', // a enlever demain
    secretOrKeyProvider: jwksRsa.passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri:
        'http://keycloak:8080/realms/MY-REALM/protocol/openid-connect/certs', 
    }),
  });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    return payload; 
  }
}
