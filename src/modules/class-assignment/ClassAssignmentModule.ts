import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import ClassAssignmentController from './application/rest/ClassAssignmentController';
import CreateClassAssignmentCommandHandler from './domain/application-service/features/create-assignment/CreateClassAssignmentCommandHandler';
import GetClassAssignmentsQueryHandler from './domain/application-service/features/get-assignments/GetClassAssignmentsQueryHandler';
import GetClassAssignmentQueryHandler from './domain/application-service/features/get-assignment/GetClassAssignmentQueryHandler';
import UpdateClassAssignmentCommandHandler from './domain/application-service/features/update-assignment/UpdateClassAssignmentCommandHandler';
import DeleteClassAssignmentCommandHandler from './domain/application-service/features/delete-assignment/DeleteClassAssignmentCommandHandler';
import ClassAssignmentRepositoryImpl from './data-access/database/adapter/ClassAssignmentRepositoryImpl';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import ClassAssignmentDynamoDBRepository from './data-access/database/repository/ClassAssignmentDynamoDBRepository';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule],
  controllers: [ClassAssignmentController],
  providers: [
    CreateClassAssignmentCommandHandler,
    GetClassAssignmentsQueryHandler,
    GetClassAssignmentQueryHandler,
    UpdateClassAssignmentCommandHandler,
    DeleteClassAssignmentCommandHandler,
    {
      provide: DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY,
      useClass: ClassAssignmentRepositoryImpl,
    },
    ClassAssignmentDynamoDBRepository,
  ],
  exports: [
    {
      provide: DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY,
      useClass: ClassAssignmentRepositoryImpl,
    },
  ],
})
export default class ClassAssignmentModule {}
