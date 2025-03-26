import { Module } from '@nestjs/common';
import PrivilegeController from './application/rest/PrivilegeController';
import CreatePrivilegeCommandHandler from './domain/application-service/features/create-privilege/CreatePrivilegeCommandHandler';
import DeletePrivilegeCommandHandler from './domain/application-service/features/delete-privilege/DeletePrivilegeCommandHandler';
import ConfigModule from '../ConfigModule';

@Module({
  imports: [ConfigModule],
  controllers: [PrivilegeController],
  providers: [CreatePrivilegeCommandHandler, DeletePrivilegeCommandHandler],
  exports: [],
})
export default class PrivilegeModule {}
