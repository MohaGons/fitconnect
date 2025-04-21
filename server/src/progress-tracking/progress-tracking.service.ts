import { Injectable } from '@nestjs/common';
import { CreateProgressTrackingDto } from './dto/create-progress-tracking.dto';
import { UpdateProgressTrackingDto } from './dto/update-progress-tracking.dto';

@Injectable()
export class ProgressTrackingService {
  create(createProgressTrackingDto: CreateProgressTrackingDto) {
    return 'This action adds a new progressTracking';
  }

  findAll() {
    return `This action returns all progressTracking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} progressTracking`;
  }

  update(id: number, updateProgressTrackingDto: UpdateProgressTrackingDto) {
    return `This action updates a #${id} progressTracking`;
  }

  remove(id: number) {
    return `This action removes a #${id} progressTracking`;
  }
}
