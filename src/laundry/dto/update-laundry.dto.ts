import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum LaundryStatus {
  PENDING = 'PENDING',
  WASHING = 'WASHING',
  DONE = 'DONE',
}

export class UpdateLaundryDto {
  @ApiPropertyOptional({ enum: LaundryStatus, description: 'Status progres cucian' })
  @IsEnum(LaundryStatus, { message: 'Status tidak valid. Gunakan PENDING, WASHING, atau DONE' })
  @IsOptional()
  status?: LaundryStatus;
}