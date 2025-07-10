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
import { ProgressPhotosService } from './progress-photos.service';
import { CreateProgressPhotoDto } from './dto/create-progress-photo.dto';
import { UpdateProgressPhotoDto } from './dto/update-progress-photo.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

@UseGuards(JwtAuthGuard) 
@Controller('progress-photos')
export class ProgressPhotosController {
  constructor(private readonly progressPhotosService: ProgressPhotosService) {}

  @Post()
  create(@Body() createProgressPhotoDto: CreateProgressPhotoDto) {
    return this.progressPhotosService.create(createProgressPhotoDto);
  }

  @Get()
  findAll() {
    return this.progressPhotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressPhotosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgressPhotoDto: UpdateProgressPhotoDto,
  ) {
    return this.progressPhotosService.update(+id, updateProgressPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressPhotosService.remove(+id);
  }
}
