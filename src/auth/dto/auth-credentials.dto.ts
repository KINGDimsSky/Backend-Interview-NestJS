import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'admin_king', description: 'Username untuk akun admin' })
  @IsString()
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username!: string;

  @ApiProperty({ example: 'password123', description: 'Password minimal 6 karakter' })
  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal harus 6 karakter' })
  password!: string;
}