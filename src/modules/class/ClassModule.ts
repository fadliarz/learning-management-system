import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import ClassController from './application/rest/ClassController';
import CreateClassCommandHandler from './domain/application-service/features/create-class/CreateClassCommandHandler';
import GetClassesQueryHandler from './domain/application-service/features/get-classes/GetClassesQueryHandler';
import GetClassQueryHandler from './domain/application-service/features/get-class/GetClassQueryHandler';
import UpdateClassCommandHandler from './domain/application-service/features/update-class/UpdateClassCommandHandler';
import ClassRepositoryImpl from './data-access/database/adapter/ClassRepositoryImpl';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import ClassDynamoDBRepository from './data-access/database/repository/ClassDynamoDBRepository';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule],
  controllers: [ClassController],
  providers: [
    CreateClassCommandHandler,
    GetClassesQueryHandler,
    GetClassQueryHandler,
    UpdateClassCommandHandler,
    {
      provide: DependencyInjection.CLASS_REPOSITORY,
      useClass: ClassRepositoryImpl,
    },
    ClassDynamoDBRepository,
  ],
  exports: [
    {
      provide: DependencyInjection.CLASS_REPOSITORY,
      useClass: ClassRepositoryImpl,
    },
  ],
})
export default class ClassModule {}
