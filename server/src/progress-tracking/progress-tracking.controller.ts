import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProgressTrackingService } from './progress-tracking.service';
import { CreateProgressTrackingDto } from './dto/create-progress-tracking.dto';
import { UpdateProgressTrackingDto } from './dto/update-progress-tracking.dto';

@Controller('progress-tracking')
export class ProgressTrackingController {
  constructor(
    private readonly progressTrackingService: ProgressTrackingService,
  ) {}

  @Post()
  create(@Body() createProgressTrackingDto: CreateProgressTrackingDto) {
    return this.progressTrackingService.create(createProgressTrackingDto);
  }

  @Get()
  findAll() {
    return this.progressTrackingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressTrackingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgressTrackingDto: UpdateProgressTrackingDto,
  ) {
    return this.progressTrackingService.update(+id, updateProgressTrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressTrackingService.remove(+id);
  }
}
