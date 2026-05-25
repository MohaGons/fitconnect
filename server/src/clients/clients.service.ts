import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  deleted?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Convert weight to number if it's a string
    const dto = {
      ...createClientDto,
      weight:
        createClientDto.weight !== undefined
          ? Number(createClientDto.weight)
          : undefined,
      height:
        createClientDto.height !== undefined
          ? Number(createClientDto.height)
          : undefined,
    };
    const client = this.clientRepository.create(dto);
    return await this.clientRepository.save(client);
  }

  async findAll(
    options: FindAllOptions = {},
  ): Promise<PaginatedResponse<Client>> {
    try {
      const { page = 1, limit = 10, search, deleted } = options;
      const skip = (page - 1) * limit;

      // Construction des conditions WHERE
      const whereConditions: any = {};

      // Filtre par statut supprimé si spécifié
      if (deleted !== undefined) {
        whereConditions.deleted = deleted;
      }

      // Construction des conditions de recherche
      let searchConditions: any[] = [];
      if (search && search.trim() !== '') {
        const searchTerm = search.trim();
        // Recherche insensible à la casse sur plusieurs champs
        searchConditions = [
          { firstName: ILike(`%${searchTerm}%`) },
          { lastName: ILike(`%${searchTerm}%`) },
          { email: ILike(`%${searchTerm}%`) },
        ];
      }

      // Log pour déboguer
      console.log('Service Clients - Find All Options:', {
        page,
        limit,
        search,
        deleted,
        skip,
        whereConditions,
        hasSearch: !!search,
      });

      // Requête principale avec les conditions
      const [clients, total] = await this.clientRepository.findAndCount({
        where: search
          ? [
              ...searchConditions.map((condition) => ({
                ...whereConditions,
                ...condition,
              })),
            ]
          : whereConditions,
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });

      // Log des résultats
      console.log('Service Clients - Résultats:', {
        clientsFound: clients.length,
        total,
        searchApplied: !!search,
      });

      return {
        data: clients,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error in findAll clients:', error);
      throw error;
    }
  }

  // Les autres méthodes restent inchangées

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { client_id: id },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return client;
  }

  async findByUserId(userId: string): Promise<{ client_id: number }> {
    const client = await this.clientRepository.findOne({
      where: { user_id: userId },
      select: ['client_id'], // Récupérer uniquement client_id
    });

    if (!client) {
      throw new NotFoundException(`Client with user_id ${userId} not found`);
    }

    return { client_id: client.client_id };
  }

  async getClientProfile(userId: string) {
    const clientProfile = await this.clientRepository.findOne({
      where: { user_id: userId },
    });
    if (!clientProfile) {
      throw new NotFoundException(`Client non trouvé pour l'userId: ${userId}`);
    }
    return clientProfile;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const result = await this.clientRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
  }
}
