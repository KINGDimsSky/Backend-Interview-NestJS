import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap pelanggan' })
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: '08123456789', description: 'Nomor WhatsApp aktif' })
  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon tidak boleh kosong' })
  @MaxLength(20)
  phone!: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No 1', description: 'Alamat lengkap pengiriman' })
  @IsString()
  @IsOptional()
  address?: string;
}