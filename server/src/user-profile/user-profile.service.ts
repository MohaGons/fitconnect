import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from '../coaches/entities/coach.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  // Méthode pour vérifier si le profil est complété
  async isProfileCompleted(userId: string): Promise<boolean> {
    const coach = await this.coachRepository.findOne({ where: { user_id: userId } });
    if (coach) {
      return true;  
    }

    const client = await this.clientRepository.findOne({ where: { user_id: userId } });
    if (client) {
      return true;  
    }

    return false;  
  }

  async findProfileByUserId(userId: string): Promise<{ type: 'coach' | 'client'; profile: Coach | Client } | null> {
    const coach = await this.coachRepository.findOne({ where: { user_id: userId } });
    if (coach) {
      return { type: 'coach', profile: coach };
    }

    const client = await this.clientRepository.findOne({ where: { user_id: userId } });
    if (client) {
      return { type: 'client', profile: client };
    }

    return null;
  }
}
