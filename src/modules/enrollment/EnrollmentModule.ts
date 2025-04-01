import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import EnrollmentController from './application/rest/EnrollmentController';
import CreateEnrollmentCommandHandler from './domain/application-service/features/create-enrollment/CreateEnrollmentCommandHandler';
import DeleteEnrollmentCommandHandler from './domain/application-service/features/delete-enrollment/DeleteEnrollmentCommandHandler';
import EnrollmentRepositoryImpl from './data-access/database/adapter/EnrollmentRepositoryImpl';
import ConfigModule from '../ConfigModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import ClassModule from '../class/ClassModule';
import EnrollmentDynamoDBRepository from './data-access/database/repository/EnrollmentDynamoDBRepository';

@Module({
  imports: [ConfigModule, PrivilegeModule, ClassModule],
  controllers: [EnrollmentController],
  providers: [
    CreateEnrollmentCommandHandler,
    DeleteEnrollmentCommandHandler,
    {
      provide: DependencyInjection.ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepositoryImpl,
    },
    EnrollmentDynamoDBRepository,
  ],
  exports: [
    {
      provide: DependencyInjection.ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepositoryImpl,
    },
    EnrollmentDynamoDBRepository,
  ],
})
export default class EnrollmentModule {}
