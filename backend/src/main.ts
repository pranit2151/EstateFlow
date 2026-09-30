import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true });

  // Global prefix for all routes: /api
  app.setGlobalPrefix('api');

  // Auto-validate incoming DTOs using class-validator decorators
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,        // Auto-transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API Base: http://localhost:${port}/api`);
}
bootstrap();
