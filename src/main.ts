import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Just to allow swagger to work on localhost

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // This part is just to make sure it's exactly same as swagger example, otherwise the validationPipe handles it the same but with different response
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) =>
            `${error.property} has wrong value ${error.value}, ${Object.values(
              error.constraints,
            ).join(', ')}`,
        );
        return new HttpException(
          { message: 'Bad Request', messageDetails: messages },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  await app.listen(8080);
}
bootstrap();
