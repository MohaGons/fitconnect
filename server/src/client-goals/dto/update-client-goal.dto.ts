import { PartialType } from '@nestjs/swagger';
import { CreateClientGoalDto } from './create-client-goal.dto';

export class UpdateClientGoalDto extends PartialType(CreateClientGoalDto) {}
