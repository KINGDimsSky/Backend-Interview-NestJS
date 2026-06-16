import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // Custom logic: Jika terjadi error internal atau user tidak ditemukan dalam payload JWT
    if (err || !user) {
      throw err || new UnauthorizedException('Akses ditolak. Token tidak valid atau sudah kedaluwarsa, KING.');
    }
    return user;
  }
}