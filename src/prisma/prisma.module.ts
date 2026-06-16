import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Kita jadikan @Global() agar tidak perlu import PrismaModule berulang kali di modul lain
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}