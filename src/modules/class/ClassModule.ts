import { Module } from '@nestjs/common';
import ClassController from './application/rest/ClassController';
import CreateClassCommandHandler from './domain/application-service/features/create-class/CreateClassCommandHandler';
import GetClassesQueryHandler from './domain/application-service/features/get-classes/GetClassesQueryHandler';
import GetClassQueryHandler from './domain/application-service/features/get-class/GetClassQueryHandler';
import UpdateClassCommandHandler from './domain/application-service/features/update-class/UpdateClassCommandHandler';
import ConfigModule from '../ConfigModule';
import DeleteClassCommandHandler from './domain/application-service/features/delete-class/DeleteClassCommandHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [ClassController],
  providers: [
    CreateClassCommandHandler,
    GetClassesQueryHandler,
    GetClassQueryHandler,
    UpdateClassCommandHandler,
    DeleteClassCommandHandler,
  ],
  exports: [],
})
export default class ClassModule {}
