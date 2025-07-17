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
import { SessionExercisesService } from './session-exercises.service';
import { CreateSessionExerciseDto } from './dto/create-session-exercise.dto';
import { UpdateSessionExerciseDto } from './dto/update-session-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('session-exercises')
export class SessionExercisesController {
  constructor(
    private readonly sessionExercisesService: SessionExercisesService,
  ) {}

  @Post()
  create(@Body() createSessionExerciseDto: CreateSessionExerciseDto) {
    return this.sessionExercisesService.create(createSessionExerciseDto);
  }

  @Get()
  findAll() {
    return this.sessionExercisesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionExercisesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSessionExerciseDto: UpdateSessionExerciseDto,
  ) {
    return this.sessionExercisesService.update(+id, updateSessionExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionExercisesService.remove(+id);
  }
}
