import { IsNotEmpty, IsNumber, IsPositive, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLaundryDto {
  @ApiProperty({ example: 3.5, description: 'Berat cucian dalam satuan Kg' })
  @IsNumber({}, { message: 'Berat cucian harus berupa angka' })
  @IsPositive({ message: 'Berat cucian tidak boleh minus atau nol' })
  @IsNotEmpty()
  weight!: number;

  @ApiProperty({ example: 1, description: 'ID Pelanggan (Customer) yang terdaftar' })
  @IsInt({ message: 'Customer ID harus berupa angka bulat' })
  @IsNotEmpty()
  customerId!: number;
}