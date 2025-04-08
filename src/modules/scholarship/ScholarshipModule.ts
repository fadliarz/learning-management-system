import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import ScholarshipController from './application/rest/ScholarshipController';
import CreateScholarshipCommandHandler from './domain/application-service/features/create-scholarship/CreateScholarshipCommandHandler';
import GetScholarshipsQueryHandler from './domain/application-service/features/get-scholarships/GetScholarshipsQueryHandler';
import GetScholarshipQueryHandler from './domain/application-service/features/get-scholarship/GetScholarshipQueryHandler';
import UpdateScholarshipCommandHandler from './domain/application-service/features/update-scholarship/UpdateScholarshipCommandHandler';
import DeleteScholarshipCommandHandler from './domain/application-service/features/delete-scholarship/DeleteScholarshipCommandHandler';
import ScholarshipRepositoryImpl from './data-access/database/adapter/ScholarshipRepositoryImpl';
import ConfigModule from '../ConfigModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import ScholarshipDynamoDBRepository from './data-access/database/repository/ScholarshipDynamoDBRepository';
import AddScholarshipTagCommandHandler from './domain/application-service/features/add-tag/AddScholarshipTagCommandHandler';
import TagModule from '../tag/TagModule';
import ScholarshipContextImpl from './data-access/context/adapter/ScholarshipContextImpl';

@Module({
  imports: [ConfigModule, PrivilegeModule, TagModule],
  controllers: [ScholarshipController],
  providers: [
    CreateScholarshipCommandHandler,
    AddScholarshipTagCommandHandler,
    GetScholarshipsQueryHandler,
    GetScholarshipQueryHandler,
    UpdateScholarshipCommandHandler,
    DeleteScholarshipCommandHandler,
    {
      provide: DependencyInjection.SCHOLARSHIP_REPOSITORY,
      useClass: ScholarshipRepositoryImpl,
    },
    ScholarshipDynamoDBRepository,
    {
      provide: DependencyInjection.SCHOLARSHIP_CONTEXT,
      useClass: ScholarshipContextImpl,
    },
  ],
  exports: [],
})
export default class ScholarshipModule {}
