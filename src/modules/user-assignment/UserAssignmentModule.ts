import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import UserAssignmentController from './application/rest/UserAssignmentController';
import UserAssignmentRepositoryImpl from './data-access/database/adapter/UserAssignmentRepositoryImpl';
import CreateUserAssignmentCommandHandler from './domain/application-service/features/create-assignment/CreateUserAssignmentCommandHandler';
import GetUserAssignmentsQueryHandler from './domain/application-service/features/get-assignments/GetUserAssignmentsQueryHandler';
import GetUserAssignmentQueryHandler from './domain/application-service/features/get-assignment/GetUserAssignmentQueryHandler';
import UpdateUserAssignmentCommandHandler from './domain/application-service/features/update-assignment/UpdateUserAssignmentCommandHandler';
import DeleteUserAssignmentCommandHandler from './domain/application-service/features/delete-assignment/DeleteUserAssignmentCommandHandler';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import UserAssignmentDynamoDBRepository from './data-access/database/repository/UserAssignmentDynamoDBRepository';
import ClassAssignmentModule from '../class-assignment/ClassAssignmentModule';
import CourseModule from '../course/CourseModule';
import GetUpcomingUserAssignmentsQueryHandler from './domain/application-service/features/get-upcoming-assignments/GetUpcomingUserAssignmentsQueryHandler';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PrivilegeModule,
    ClassAssignmentModule,
    CourseModule,
  ],
  controllers: [UserAssignmentController],
  providers: [
    CreateUserAssignmentCommandHandler,
    GetUserAssignmentsQueryHandler,
    GetUpcomingUserAssignmentsQueryHandler,
    GetUserAssignmentQueryHandler,
    UpdateUserAssignmentCommandHandler,
    DeleteUserAssignmentCommandHandler,
    {
      provide: DependencyInjection.USER_ASSIGNMENT_REPOSITORY,
      useClass: UserAssignmentRepositoryImpl,
    },
    UserAssignmentDynamoDBRepository,
  ],
  exports: [],
})
export default class UserAssignmentModule {}
