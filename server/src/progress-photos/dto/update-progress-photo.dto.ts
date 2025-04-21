import { PartialType } from '@nestjs/swagger';
import { CreateProgressPhotoDto } from './create-progress-photo.dto';

export class UpdateProgressPhotoDto extends PartialType(
  CreateProgressPhotoDto,
) {}
