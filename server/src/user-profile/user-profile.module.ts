import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileController } from './user-profile.controller';
import { CompleteRegistrationGuard } from './profile-completion.guard';
import { UserProfileService } from './user-profile.service'; 
import { Coach } from '../coaches/entities/coach.entity';
import { Client } from '../clients/entities/client.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Coach, Client])],
  controllers: [UserProfileController],
  providers: [CompleteRegistrationGuard, UserProfileService], 
  exports: [UserProfileService], 
})
export class UserProfileModule {}
