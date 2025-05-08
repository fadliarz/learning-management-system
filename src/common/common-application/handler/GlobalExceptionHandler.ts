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

    let message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof NestHttpException
          ? exception.getResponse()
          : 'Internal Server Error';

    if (typeof message === 'object' && 'message' in message) {
      const messageObj = message as { message: string[] | string };
      message = Array.isArray(messageObj.message)
        ? messageObj.message[0]
        : messageObj.message;
    }

    console.log('@GlobalExceptionHandler: ', {
      path: request.url,
      body: request.body,
      date: new Date().toISOString(),
      statusCode: status,
      message,
      errorObj: exception,
      throwable:
        exception instanceof HttpException ? exception.throwable : null,
    });

    if (status === 401) {
      response.clearCookie(this.cookieConfig.ACCESS_TOKEN_KEY, { path: '/' });
      response.clearCookie(this.cookieConfig.REFRESH_TOKEN_KEY, {
        path: '/',
      });
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
