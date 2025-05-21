import { Module } from '@nestjs/common';
import ConfigModule from '../ConfigModule';
import InstructorController from './application/rest/InstructorController';
import CreateInstructorCommandHandler from './domain/application-service/features/create-instructor/CreateInstructorCommandHandler';
import GetInstructorsQueryHandler from './domain/application-service/features/get-instructors/GetInstructorsQueryHandler';
import DeleteInstructorCommandHandler from './domain/application-service/features/delete-instructor/DeleteInstructorCommandHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [InstructorController],
  providers: [
    CreateInstructorCommandHandler,
    GetInstructorsQueryHandler,
    DeleteInstructorCommandHandler,
  ],
  exports: [],
})
export default class InstructorModule {}
