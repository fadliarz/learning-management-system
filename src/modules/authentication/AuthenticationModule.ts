import { Module } from '@nestjs/common';
import ConfigModule from '../ConfigModule';
import AuthenticationController from './application/rest/AuthenticationController';
import SignInCommandHandler from './domain/application-service/features/sign-in/SignInCommandHandler';
import SignOutCommandHandler from './domain/application-service/features/sign-out/SignOutCommandHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [AuthenticationController],
  providers: [SignInCommandHandler, SignOutCommandHandler],
  exports: [],
})
export default class AuthenticationModule {}
