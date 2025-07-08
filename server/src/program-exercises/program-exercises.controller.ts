import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProgramExercisesService } from './program-exercises.service';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { UpdateProgramExerciseDto } from './dto/update-program-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('program-exercises')
export class ProgramExercisesController {
  constructor(
    private readonly programExercisesService: ProgramExercisesService,
  ) {}

  @Post()
  create(@Body() createProgramExerciseDto: CreateProgramExerciseDto) {
    return this.programExercisesService.create(createProgramExerciseDto);
  }

  @Get()
  findAll() {
    return this.programExercisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programExercisesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgramExerciseDto: UpdateProgramExerciseDto,
  ) {
    return this.programExercisesService.update(+id, updateProgramExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programExercisesService.remove(+id);
  }
}
