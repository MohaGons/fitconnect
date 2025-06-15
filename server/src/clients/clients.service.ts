import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create({
      ...createClientDto,
      weight: createClientDto.weight
        ? Number(createClientDto.weight)
        : undefined,
      height: createClientDto.height
        ? Number(createClientDto.height)
        : undefined,
    });
    return this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { client_id: id },
      relations: ['subscriptions', 'sessions', 'progress_trackings'],
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return client;
  }

  async findByUserId(userId: string): Promise<{ client_id: number }> {
    const client = await this.clientRepository.findOne({
      where: { user_id: userId },
      select: ['client_id'],
    });

    if (!client) {
      throw new NotFoundException(`Client with user_id ${userId} not found`);
    }

    return { client_id: client.client_id };
  }

  async findByUserIdFull(userId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { user_id: userId },
      relations: ['subscriptions', 'sessions'],
    });

    if (!client) {
      throw new NotFoundException(`Client with user_id ${userId} not found`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    const updateData = {
      ...updateClientDto,
      weight: updateClientDto.weight
        ? Number(updateClientDto.weight)
        : client.weight,
      height: updateClientDto.height
        ? Number(updateClientDto.height)
        : client.height,
    };

    Object.assign(client, updateData);
    return this.clientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clientRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }

  // Méthode utile pour obtenir un client avec ses informations utilisateur
  async getClientProfile(userId: string): Promise<any> {
    const client = await this.findByUserIdFull(userId);

    // Ici vous pourriez ajouter des informations supplémentaires
    // depuis Keycloak si nécessaire
    return {
      client_id: client.client_id,
      user_id: client.user_id,
      birth_date: client.birth_date,
      weight: client.weight,
      height: client.height,
      goal: client.goal,
      dietary_restrictions: client.dietary_restrictions,
      health_issues: client.health_issues,
      sport_experience: client.sport_experience,
      created_at: client.created_at,
      updated_at: client.updated_at,
    };
  }
}
