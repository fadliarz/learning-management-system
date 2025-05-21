import { Module } from '@nestjs/common';
import UserAssignmentController from './application/rest/UserAssignmentController';
import CreateUserAssignmentCommandHandler from './domain/application-service/features/create-assignment/CreateUserAssignmentCommandHandler';
import GetUserAssignmentsQueryHandler from './domain/application-service/features/get-assignments/GetUserAssignmentsQueryHandler';
import GetUserAssignmentQueryHandler from './domain/application-service/features/get-assignment/GetUserAssignmentQueryHandler';
import UpdateUserAssignmentCommandHandler from './domain/application-service/features/update-assignment/UpdateUserAssignmentCommandHandler';
import DeleteUserAssignmentCommandHandler from './domain/application-service/features/delete-assignment/DeleteUserAssignmentCommandHandler';
import ConfigModule from '../ConfigModule';
import GetUpcomingUserAssignmentsQueryHandler from './domain/application-service/features/get-upcoming-assignments/GetUpcomingUserAssignmentsQueryHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [UserAssignmentController],
  providers: [
    CreateUserAssignmentCommandHandler,
    GetUserAssignmentsQueryHandler,
    GetUpcomingUserAssignmentsQueryHandler,
    GetUserAssignmentQueryHandler,
    UpdateUserAssignmentCommandHandler,
    DeleteUserAssignmentCommandHandler,
  ],
  exports: [],
})
export default class UserAssignmentModule {}
