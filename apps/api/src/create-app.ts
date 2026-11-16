import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/http-error.filter';

/** HTTP application shared by the server and the integration tests. */
export async function createApp(options?: { readonly silent?: boolean }): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: options?.silent ? false : undefined,
  });
  const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');

  mkdirSync(uploadDir, { recursive: true });
  app.use(cookieParser());
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.setGlobalPrefix('api');
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpErrorFilter());

  return app;
}
