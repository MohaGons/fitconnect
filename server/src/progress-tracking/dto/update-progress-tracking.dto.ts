import { PartialType } from '@nestjs/swagger';
import { CreateProgressTrackingDto } from './create-progress-tracking.dto';

export class UpdateProgressTrackingDto extends PartialType(
  CreateProgressTrackingDto,
) {}
