import {
  ArgumentsHost,
  Catch,
  HttpException as NestHttpException,
  HttpStatus,
} from '@nestjs/common';
import HttpException from '../../common-domain/exception/HttpException';
import { FastifyReply } from 'fastify';

@Catch()
export default class GlobalExceptionHandler {
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

    response.status(status).send({
      error: {
        statusCode: status,
        message,
      },
    });
  }
}
