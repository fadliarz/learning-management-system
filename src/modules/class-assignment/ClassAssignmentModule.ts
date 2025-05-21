import { Module } from '@nestjs/common';
import ClassAssignmentController from './application/rest/ClassAssignmentController';
import CreateClassAssignmentCommandHandler from './domain/application-service/features/create-assignment/CreateClassAssignmentCommandHandler';
import GetClassAssignmentsQueryHandler from './domain/application-service/features/get-assignments/GetClassAssignmentsQueryHandler';
import GetClassAssignmentQueryHandler from './domain/application-service/features/get-assignment/GetClassAssignmentQueryHandler';
import UpdateClassAssignmentCommandHandler from './domain/application-service/features/update-assignment/UpdateClassAssignmentCommandHandler';
import DeleteClassAssignmentCommandHandler from './domain/application-service/features/delete-assignment/DeleteClassAssignmentCommandHandler';
import ConfigModule from '../ConfigModule';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [ClassAssignmentController],
  providers: [
    CreateClassAssignmentCommandHandler,
    GetClassAssignmentsQueryHandler,
    GetClassAssignmentQueryHandler,
    UpdateClassAssignmentCommandHandler,
    DeleteClassAssignmentCommandHandler,
  ],
  exports: [],
})
export default class ClassAssignmentModule {}
