import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const existingAdmin = await this.prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) {
      throw new ConflictException('Username sudah terdaftar di sistem');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await this.prisma.admin.create({
      data: { username, password: hashedPassword },
    });

    return { username: admin.username, message: 'Admin berhasil didaftarkan' };
  }

  async login(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    const admin = await this.prisma.admin.findUnique({ where: { username } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Kredensial salah, periksa username atau password Anda');
    }

    const payload = { sub: admin.id, username: admin.username };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }
}