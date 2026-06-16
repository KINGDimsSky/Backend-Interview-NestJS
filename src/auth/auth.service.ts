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

    // 1. Cek Duplikasi Username (Edge Case)
    const existingAdmin = await this.prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) {
      throw new ConflictException('Username sudah terdaftar di sistem');
    }

    // 2. Hashing Password dengan Bcrypt (10 Salt Rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke Database SQL
    const admin = await this.prisma.admin.create({
      data: { username, password: hashedPassword },
    });

    return { username: admin.username, message: 'Admin berhasil didaftarkan' };
  }

  async login(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    // 1. Cari Admin berdasarkan Username
    const admin = await this.prisma.admin.findUnique({ where: { username } });

    // 2. Bandingkan Hash Password
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Kredensial salah, periksa username atau password Anda');
    }

    // 3. Generate JWT Token
    const payload = { sub: admin.id, username: admin.username };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }
}