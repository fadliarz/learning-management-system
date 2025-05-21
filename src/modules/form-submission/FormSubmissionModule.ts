import { Module } from '@nestjs/common';
import ConfigModule from '../ConfigModule';
import FormSubmissionController from './application/rest/FormSubmissionController';
import CreateFormSubmissionCommandHandler from './domain/application-service/features/create-submission/CreateFormSubmissionCommandHandler';
import GetFormSubmissionsQueryHandler from './domain/application-service/features/get-submissions/GetFormSubmissionsQueryHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [FormSubmissionController],
  providers: [
    CreateFormSubmissionCommandHandler,
    GetFormSubmissionsQueryHandler,
  ],
  exports: [],
})
export default class FormSubmissionModule {}
