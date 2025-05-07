import 'reflect-metadata';
import { config } from 'dotenv';
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
import CourseCacheMemory from './modules/course/domain/application-service/ports/output/cache/CourseCache';
import { DependencyInjection } from './common/common-domain/DependencyInjection';
import { CourseRepository } from './modules/course/domain/application-service/ports/output/repository/CourseRepository';
import Course from './modules/course/domain/domain-core/entity/Course';
import Pagination from './common/common-domain/repository/Pagination';
import CacheConfig from './config/CacheConfig';

config();

export default class Application {
  private _app: NestFastifyApplication;
  private cookieConfig: CookieConfig;
  private cacheConfig: CacheConfig;
  private courseCacheMemory: CourseCacheMemory;
  private courseRepository: CourseRepository;

  constructor() {}

  public async init(): Promise<void> {
    this._app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

    this._app.enableCors({
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    /**
     * Global Pipe 설정q
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

    this.setupDependencies();

    await this.loadCache();

    this.startMemoryUsageLogging();
  }

  public async listen(): Promise<void> {
    await this._app.listen(process.env.PORT || 2212, '0.0.0.0');
  }

  public async loadCache(): Promise<void> {
    await this.loadCourseCache();
  }

  private setupDependencies(): void {
    this.cacheConfig = this._app.get(CacheConfig);
    if (this.cacheConfig === undefined) {
      throw new RuntimeException('CacheConfig is not defined');
    }
    this.courseCacheMemory = this._app.get(
      DependencyInjection.COURSE_CACHE_MEMORY,
    );
    if (this.courseCacheMemory === undefined) {
      throw new RuntimeException('CourseCacheMemory is not defined');
    }
    this.courseRepository = this._app.get(
      DependencyInjection.COURSE_REPOSITORY,
    );
    if (this.courseRepository === undefined) {
      throw new RuntimeException('CourseRepository is not defined');
    }
  }

  private async loadCourseCache(): Promise<void> {
    const keys = await this.courseCacheMemory.getKeysByIndex();
    console.info('[LOAD_COURSE_CACHE] - Loading course cache...');
    if (keys.length === 0) {
      console.info(
        '[LOAD_COURSE_CACHE] - Found 0 course cache key(s). Loading from database...',
      );
      const courses: Course[] = await this.courseRepository.findMany({
        pagination: new Pagination(),
      });
      courses.forEach((course) => {
        this.courseCacheMemory.setAndSaveIndex({
          key: course.courseId,
          value: course,
          options: { ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC },
        });
      });
      return;
    }
    console.info(
      `[LOAD_COURSE_CACHE] - Found ${keys.length} course cache keys, database load skipped.`,
    );
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
