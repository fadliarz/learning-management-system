import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import GlobalExceptionHandler from './common/common-application/handler/GlobalExceptionHandler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppModule from './AppModule';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import CookieConfig from './config/CookieConfig';
import fastifyCookie from '@fastify/cookie';

export default class Application {
  private _app: NestFastifyApplication;
  private cookieConfig: CookieConfig;

  constructor() {}

  public async init(): Promise<void> {
    this._app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

    this.cookieConfig = this._app.get(CookieConfig);
    if (this.cookieConfig === undefined) {
      throw new RuntimeException('CookieConfig is not defined');
    }

    /**
     * Global Pipe 설정
     */
    this._app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    /**
     * Global Exception Handler
     */
    this._app.useGlobalFilters(this._app.get(GlobalExceptionHandler));

    /**
     * Cookie
     */
    await this._app.register(fastifyCookie, {});

    /**
     * Swagger
     */
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(this._app, config);
    SwaggerModule.setup('api-docs', this._app, document);

    this.startMemoryUsageLogging();
  }

  public async listen(): Promise<void> {
    if (
      process.env.NODE_ENV &&
      process.env.NODE_ENV.toLowerCase() === 'development'
    ) {
      await this._app.listen(process.env.PORT || 2212);
    } else {
      await this._app.listen(process.env.PORT || 2212, '0.0.0.0');
    }
  }

  private startMemoryUsageLogging(): void {
    setInterval(
      () => {
        const memoryUsage = process.memoryUsage();
        console.log(`Memory Usage at ${new Date().toISOString()}:`);
        console.log(
          `  RSS (Resident Set Size): ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        );
        console.log(
          `  Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        );
        console.log(
          `  Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        );
        console.log(
          `  External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
        );
      },
      1000 * 60 * 15,
    );
  }
}
