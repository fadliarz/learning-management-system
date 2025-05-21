import { Module } from '@nestjs/common';
import PrivilegeController from './application/rest/PrivilegeController';
import CreatePrivilegeCommandHandler from './domain/application-service/features/create-privilege/CreatePrivilegeCommandHandler';
import DeletePrivilegeCommandHandler from './domain/application-service/features/delete-privilege/DeletePrivilegeCommandHandler';
import ConfigModule from '../ConfigModule';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [PrivilegeController],
  providers: [CreatePrivilegeCommandHandler, DeletePrivilegeCommandHandler],
  exports: [],
})
export default class PrivilegeModule {}
