import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // BEST PRACTICE REST API: Mengambil token dari Authorization Header sebagai Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KING_BACKUP_123',
    });
  }

  async validate(payload: { sub: number; username: string }) {
    // Cari admin di database untuk memastikan akunnya masih aktif
    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
    });

    if (!admin) {
      throw new UnauthorizedException('Akses ditolak, token tidak valid');
    }

    // Objek yang di-return di sini otomatis disuntikkan ke dalam objek 'req.user'
    return { id: admin.id, username: admin.username };
  }
}