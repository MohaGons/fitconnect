import { Injectable } from '@nestjs/common';
import { CreateClientGoalDto } from './dto/create-client-goal.dto';
import { UpdateClientGoalDto } from './dto/update-client-goal.dto';

@Injectable()
export class ClientGoalsService {
  create(createClientGoalDto: CreateClientGoalDto) {
    return 'This action adds a new clientGoal';
  }

  findAll() {
    return `This action returns all clientGoals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientGoal`;
  }

  update(id: number, updateClientGoalDto: UpdateClientGoalDto) {
    return `This action updates a #${id} clientGoal`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientGoal`;
  }
}
