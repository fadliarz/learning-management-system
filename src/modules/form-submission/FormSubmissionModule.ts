import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import ConfigModule from '../ConfigModule';
import FormSubmissionRepositoryImpl from './data-access/database/adapter/FormSubmissionRepositoryImpl';
import FormSubmissionDynamoDBRepository from './data-access/database/repository/FormSubmissinDynamoDBRepository';
import FormSubmissionController from './application/rest/FormSubmissionController';
import CreateFormSubmissionCommandHandler from './domain/application-service/features/create-submission/CreateFormSubmissionCommandHandler';
import GetFormSubmissionsQueryHandler from './domain/application-service/features/get-submissions/GetFormSubmissionsQueryHandler';

@Module({
  imports: [ConfigModule],
  controllers: [FormSubmissionController],
  providers: [
    CreateFormSubmissionCommandHandler,
    GetFormSubmissionsQueryHandler,
    {
      provide: DependencyInjection.FORM_SUBMISSION_REPOSITORY,
      useClass: FormSubmissionRepositoryImpl,
    },
    FormSubmissionDynamoDBRepository,
  ],
  exports: [],
})
export default class FormSubmissionModule {}
