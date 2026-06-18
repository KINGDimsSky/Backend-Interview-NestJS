import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        
    transform: true,        
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Laundry REST API')
    .setDescription('Dokumentasi API Sistem Manajemen Laundry Profesional')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API is running on: http://localhost:3000/api`);
  console.log(`📝 Documentation is running on: http://localhost:3000/api/docs`);
}
bootstrap();