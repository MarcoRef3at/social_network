import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Just to allow swagger to work on localhost

  await app.listen(8080);
}
bootstrap();
