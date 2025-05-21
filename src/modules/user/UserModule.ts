import { Module } from '@nestjs/common';
import UserController from './application/rest/UserController';
import CreateUserCommandHandler from './domain/application-service/features/create-user/CreateUserCommandHandler';
import GetMeQueryHandler from './domain/application-service/features/get-me/GetMeQueryHandler';
import UpdateUserProfileCommandHandler from './domain/application-service/features/update-user-profile/UpdateUserProfileCommandHandler';
import UpdateUserPasswordCommandHandler from './domain/application-service/features/update-user-password/UpdateUserPasswordCommandHandler';
import ConfigModule from '../ConfigModule';
import GetUserPrivilegesQueryHandler from './domain/application-service/features/get-user-privileges/GetUserPrivilegesQueryHandler';
import GetPublicUsersQueryHandler from './domain/application-service/features/get-public-users/GetPublicUsersQueryHandler';
import GetUserEnrolledCoursesQueryHandler from './domain/application-service/features/get-user-enrolled-courses/GetUserEnrolledCoursesQueryHandler';
import GetUserCalendarQueryHandler from './domain/application-service/features/get-user-calendar/GetUserCalendarQueryHandler';
import DataAccessModule from '../DataAccessModule';
import GetUserManagedClassesQueryHandler from './domain/application-service/features/get-user-managed-classes/GetUserManagedClassesQueryHandler';
import GetAdminStatusQueryHandler from './domain/application-service/features/get-admin-status/GetAdminStatusQueryHandler';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [UserController],
  providers: [
    CreateUserCommandHandler,
    GetAdminStatusQueryHandler,
    GetMeQueryHandler,
    GetUserPrivilegesQueryHandler,
    GetUserCalendarQueryHandler,
    GetPublicUsersQueryHandler,
    GetUserEnrolledCoursesQueryHandler,
    GetUserManagedClassesQueryHandler,
    UpdateUserProfileCommandHandler,
    UpdateUserPasswordCommandHandler,
  ],
  exports: [],
})
export default class UserModule {}
