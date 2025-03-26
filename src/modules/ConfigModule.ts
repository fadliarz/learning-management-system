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

@Global()
@Module({
  imports: [],
  providers: [
    DynamoDBConfig,
    {
      provide: DependencyInjection.DYNAMODB_DOCUMENT_CLIENT,
      useFactory: (dynamoDBConfig: DynamoDBConfig) => {
        return DynamoDBDocumentClient.from(
          new DynamoDBClient({ region: 'ap-southeast-3' }),
        );
      },
    },
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
  ],
  exports: [
    DynamoDBConfig,
    {
      provide: DependencyInjection.DYNAMODB_DOCUMENT_CLIENT,
      useFactory: (dynamoDBConfig: DynamoDBConfig) => {
        return DynamoDBDocumentClient.from(
          new DynamoDBClient({ region: 'ap-southeast-3' }),
        );
      },
    },
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
