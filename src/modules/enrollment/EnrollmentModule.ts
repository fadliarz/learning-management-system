import { Module } from '@nestjs/common';
import EnrollmentController from './application/rest/EnrollmentController';
import CreateEnrollmentCommandHandler from './domain/application-service/features/create-enrollment/CreateEnrollmentCommandHandler';
import DeleteEnrollmentCommandHandler from './domain/application-service/features/delete-enrollment/DeleteEnrollmentCommandHandler';
import ConfigModule from '../ConfigModule';
import GetUserEnrollmentsQueryHandler from './domain/application-service/features/get-user-enrollments/GetUserEnrollmentsQueryHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [EnrollmentController],
  providers: [
    CreateEnrollmentCommandHandler,
    GetUserEnrollmentsQueryHandler,
    DeleteEnrollmentCommandHandler,
  ],
  exports: [],
})
export default class EnrollmentModule {}
