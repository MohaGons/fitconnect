import { Injectable } from '@nestjs/common';
import { CreateProgressPhotoDto } from './dto/create-progress-photo.dto';
import { UpdateProgressPhotoDto } from './dto/update-progress-photo.dto';

@Injectable()
export class ProgressPhotosService {
  create(createProgressPhotoDto: CreateProgressPhotoDto) {
    return 'This action adds a new progressPhoto';
  }

  findAll() {
    return `This action returns all progressPhotos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} progressPhoto`;
  }

  update(id: number, updateProgressPhotoDto: UpdateProgressPhotoDto) {
    return `This action updates a #${id} progressPhoto`;
  }

  remove(id: number) {
    return `This action removes a #${id} progressPhoto`;
  }
}
