import { Module } from '@nestjs/common';
import { ClientGoalsService } from './client-goals.service';
import { ClientGoalsController } from './client-goals.controller';

@Module({
  controllers: [ClientGoalsController],
  providers: [ClientGoalsService],
})
export class ClientGoalsModule {}
