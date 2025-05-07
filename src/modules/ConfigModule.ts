import { Global, Module } from '@nestjs/common';
import DynamoDBConfig from '../config/DynamoDBConfig';
import { JwtService } from '@nestjs/jwt';
import { DependencyInjection } from '../common/common-domain/DependencyInjection';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import AuthenticationServiceImpl from './authentication/data-access/service/authentication/adapter/AuthenticationServiceImpl';
import { AuthenticationGuard } from './authentication/domain/application-service/AuthenticationGuard';
import AuthorizationService from '../common/common-domain/features/AuthorizationService';
import UserRepositoryImpl from './user/data-access/database/adapter/UserRepositoryImpl';
import UserDynamoDbRepository from './user/data-access/database/repository/UserDynamoDBRepository';
import PrivilegeRepositoryImpl from './privilege/data-access/database/adapter/PrivilegeRepositoryImpl';
import PrivilegeDynamoDBRepository from './privilege/data-access/database/repository/PrivilegeDynamoDBRepository';
import CookieConfig from '../config/CookieConfig';
import GlobalConfig from '../config/GlobalConfig';
import GlobalExceptionHandler from '../common/common-application/handler/GlobalExceptionHandler';
import RedisConfig from '../config/RedisConfig';
import { Redis } from 'ioredis';
import CacheConfig from '../config/CacheConfig';
import RedisCacheMemory from '../common/common-data-access/cache/redis/RedisCacheMemory';

@Global()
@Module({
  imports: [],
  providers: [
    GlobalConfig,
    DynamoDBConfig,
    CookieConfig,
    RedisConfig,
    CacheConfig,
    {
      provide: DependencyInjection.DYNAMODB_DOCUMENT_CLIENT,
      useFactory: (dynamoDBConfig: DynamoDBConfig) => {
        return DynamoDBDocumentClient.from(
          new DynamoDBClient({ region: 'ap-southeast-3' }),
        );
      },
    },
    {
      provide: DependencyInjection.REDIS_CLIENT,
      useFactory: (redisConfig: RedisConfig) => {
        return new Redis({
          host: redisConfig.REDIS_HOST,
          port: redisConfig.REDIS_PORT,
          password: redisConfig.REDIS_PASSWORD,
        });
      },
      inject: [RedisConfig],
    },
    RedisCacheMemory,
    JwtService,
    {
      provide: DependencyInjection.AUTHENTICATION_SERVICE,
      useClass: AuthenticationServiceImpl,
    },
    AuthenticationGuard,
    AuthorizationService,

    {
      provide: DependencyInjection.USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    UserDynamoDbRepository,

    {
      provide: DependencyInjection.PRIVILEGE_REPOSITORY,
      useClass: PrivilegeRepositoryImpl,
    },
    PrivilegeDynamoDBRepository,
    GlobalExceptionHandler,
  ],
  exports: [
    GlobalConfig,
    DynamoDBConfig,
    CookieConfig,
    RedisConfig,
    CacheConfig,
    {
      provide: DependencyInjection.DYNAMODB_DOCUMENT_CLIENT,
      useFactory: (dynamoDBConfig: DynamoDBConfig) => {
        return DynamoDBDocumentClient.from(
          new DynamoDBClient({ region: 'ap-southeast-3' }),
        );
      },
    },
    {
      provide: DependencyInjection.REDIS_CLIENT,
      useFactory: (redisConfig: RedisConfig) => {
        return new Redis({
          host: '127.0.0.1',
          port: redisConfig.REDIS_PORT,
          password: redisConfig.REDIS_PASSWORD,
        });
      },
      inject: [RedisConfig],
    },
    RedisCacheMemory,
    JwtService,
    {
      provide: DependencyInjection.AUTHENTICATION_SERVICE,
      useClass: AuthenticationServiceImpl,
    },
    AuthenticationGuard,
    AuthorizationService,

    {
      provide: DependencyInjection.USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },

    {
      provide: DependencyInjection.PRIVILEGE_REPOSITORY,
      useClass: PrivilegeRepositoryImpl,
    },
  ],
})
export default class ConfigModule {}
