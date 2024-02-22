import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sequelize = app.get(Sequelize);
  await sequelize.sync();

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

  const config = new DocumentBuilder()
    .setTitle('Social Network')
    .setDescription('[ Base URL: localhost:8080/ ]\n\nSocial Network')
    .setVersion('1.0')
    .addTag('APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
