import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import InstructorRepositoryImpl from './data-access/database/adapter/InstructorRepositoryImpl';
import InstructorController from './application/rest/InstructorController';
import CreateInstructorCommandHandler from './domain/application-service/features/create-instructor/CreateInstructorCommandHandler';
import GetInstructorsQueryHandler from './domain/application-service/features/get-instructors/GetInstructorsQueryHandler';
import DeleteInstructorCommandHandler from './domain/application-service/features/delete-instructor/DeleteInstructorCommandHandler';
import InstructorDynamoDBRepository from './data-access/database/repository/InstructorDynamoDBRepository';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule],
  controllers: [InstructorController],
  providers: [
    CreateInstructorCommandHandler,
    GetInstructorsQueryHandler,
    DeleteInstructorCommandHandler,
    {
      provide: DependencyInjection.INSTRUCTOR_REPOSITORY,
      useClass: InstructorRepositoryImpl,
    },
    InstructorDynamoDBRepository,
  ],
  exports: [],
})
export default class InstructorModule {}
