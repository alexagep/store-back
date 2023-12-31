import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './common/error.filter';
import { ValidationPipe } from '@nestjs/common';
import { QueryFailedFilter } from './common/failedError';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.getHttpAdapter();

  // app.useGlobalFilters(new ErrorFilter(httpAdapter));

  app.useGlobalFilters(new QueryFailedFilter());

  
  // app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // Only allow properties defined in the DTO
      transform: true,
    }),
  );

  await app.listen(3000, (): void => {
    console.log('server is running on port', 3000);
  });
}
bootstrap();
