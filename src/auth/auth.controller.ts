import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'; 
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Mendaftarkan admin baru' })
  @ApiResponse({ status: 201, description: 'Admin sukses dibuat' })
  @ApiResponse({ status: 409, description: 'Username duplikat' })
  register(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.register(authCredentialsDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) 
  @ApiOperation({ summary: 'Login admin untuk mendapatkan Bearer Token' })
  @ApiResponse({ status: 200, description: 'Sukses mendapatkan token' })
  @ApiResponse({ status: 401, description: 'Kredensial salah' })
  login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto);
  }
}