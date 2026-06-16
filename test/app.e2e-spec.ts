import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http.exception.filter'; // Pastikan nama file sesuai (.exception atau -exception)
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Authentication System (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  const dummyUsername = `king_${Date.now()}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    await app.init();
    
    prismaService = app.get(PrismaService);
  });

  afterAll(async () => {
    await prismaService.admin.deleteMany({
      where: { username: dummyUsername },
    });
    await prismaService.$disconnect();
    await app.close();
  });

  it('POST /api/auth/register -> Harus sukses membuat admin baru (201)', async () => {
    const response = await request(app.getHttpServer()) // Sekarang ini dijamin tidak akan error lagi
      .post('/api/auth/register')
      .send({
        username: dummyUsername,
        password: 'superpassword123',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe(dummyUsername);
  });

  it('POST /api/auth/register -> Harus gagal jika password kurang dari 6 karakter (400)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: 'illegal_king',
        password: '123',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(400);
  });

  it('POST /api/auth/login -> Harus sukses login dan mengembalikan access_token (200)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: dummyUsername,
        password: 'superpassword123',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('access_token');
  });
});