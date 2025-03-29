import { Module } from '@nestjs/common';
import UserController from './application/rest/UserController';
import CreateUserCommandHandler from './domain/application-service/features/create-user/CreateUserCommandHandler';
import GetMeQueryHandler from './domain/application-service/features/get-me/GetMeQueryHandler';
import UpdateUserProfileCommandHandler from './domain/application-service/features/update-user-profile/UpdateUserProfileCommandHandler';
import UpdateUserPasswordCommandHandler from './domain/application-service/features/update-user-password/UpdateUserPasswordCommandHandler';
import ConfigModule from '../ConfigModule';
import GetUserPrivilegesQueryHandler from './domain/application-service/features/get-user-privileges/GetUserPrivilegesQueryHandler';
import GetPublicUsersQueryHandler from './domain/application-service/features/get-public-users/GetPublicUsersQueryHandler';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [
    CreateUserCommandHandler,
    GetMeQueryHandler,
    GetUserPrivilegesQueryHandler,
    GetPublicUsersQueryHandler,
    UpdateUserProfileCommandHandler,
    UpdateUserPasswordCommandHandler,
  ],
  exports: [],
})
export default class UserModule {}
