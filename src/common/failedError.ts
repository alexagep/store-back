import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception['code'] === '23505') {
      // unique violation error
      response
        .status(409)
        .json({
          statusCode: 409,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Email already in use',
        });
    } else {
      // other database errors
      response
        .status(500)
        .json({
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Internal server error',
        });
    }
  }
}
