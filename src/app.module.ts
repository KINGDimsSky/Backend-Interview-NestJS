import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { LaundryModule } from './laundry/laundry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Mengaktifkan pembacaan .env di seluruh aplikasi
    PrismaModule, AuthModule, CustomersModule, LaundryModule,
  ],
})
export class AppModule {}