import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientGoalsService } from './client-goals.service';
import { CreateClientGoalDto } from './dto/create-client-goal.dto';
import { UpdateClientGoalDto } from './dto/update-client-goal.dto';

@Controller('client-goals')
export class ClientGoalsController {
  constructor(private readonly clientGoalsService: ClientGoalsService) {}

  @Post()
  create(@Body() createClientGoalDto: CreateClientGoalDto) {
    return this.clientGoalsService.create(createClientGoalDto);
  }

  @Get()
  findAll() {
    return this.clientGoalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientGoalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientGoalDto: UpdateClientGoalDto,
  ) {
    return this.clientGoalsService.update(+id, updateClientGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientGoalsService.remove(+id);
  }
}
