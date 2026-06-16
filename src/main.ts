import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Set Global API Prefix
  app.setGlobalPrefix('api');

  // 2. Pasang Global Filter & Interceptor yang baru kita buat
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // 3. Aktifkan Validasi Otomatis (class-validator) dengan Strict Mode
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Membuang properti yang tidak ada di DTO
    transform: true,        // Otomatis mengubah tipe data (misal string "1" ke number 1)
    forbidNonWhitelisted: true, // Melempar error jika client mengirim properti ilegal
  }));

  // 4. Setup Swagger Dokumentasi Otomatis (Nilai Plus di mata Interviewer)
  const config = new DocumentBuilder()
    .setTitle('Laundry REST API')
    .setDescription('Dokumentasi API Sistem Manajemen Laundry Profesional')
    .setVersion('1.0')
    .addBearerAuth() // Aktifkan opsi input token JWT di UI Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API is running on: http://localhost:3000/api`);
  console.log(`📝 Documentation is running on: http://localhost:3000/api/docs`);
}
bootstrap();