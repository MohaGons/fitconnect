import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';

@Module({
  controllers: [ProgramsController],
  providers: [ProgramsService],
})
export class ProgramsModule {}
