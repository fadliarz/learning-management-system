import {
  ArgumentsHost,
  Catch,
  HttpException as NestHttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import HttpException from '../../common-domain/exception/HttpException';
import { FastifyReply } from 'fastify';
import CookieConfig from '../../../config/CookieConfig';

@Injectable()
@Catch()
export default class GlobalExceptionHandler {
  constructor(private readonly cookieConfig: CookieConfig) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.statusCode
        : exception instanceof NestHttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof NestHttpException
          ? exception.getResponse()
          : 'Internal Server Error';

    console.log('@Error: ', {
      statusCode: status,
      date: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      path: request.url,
      message,
      errorObj: exception,
    });

    if (status === 401) {
      response.clearCookie(this.cookieConfig.ACCESS_TOKEN_KEY, { path: '/' });
      response.clearCookie(this.cookieConfig.REFRESH_TOKEN_KEY, { path: '/' });
      response.clearCookie(this.cookieConfig.ACCESS_TOKEN_KEY, {
        path: '/api-docs',
      });
      response.clearCookie(this.cookieConfig.REFRESH_TOKEN_KEY, {
        path: '/api-docs',
      });
      response.clearCookie(this.cookieConfig.ACCESS_TOKEN_KEY, {
        path: '/api/v1',
      });
      response.clearCookie(this.cookieConfig.REFRESH_TOKEN_KEY, {
        path: '/api/v1',
      });
    }

    response.status(status).send({
      error: {
        statusCode: status,
        message,
      },
    });
  }
}
