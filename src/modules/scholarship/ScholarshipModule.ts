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
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import ScholarshipDynamoDBRepository from './data-access/database/repository/ScholarshipDynamoDBRepository';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule],
  controllers: [ScholarshipController],
  providers: [
    CreateScholarshipCommandHandler,
    GetScholarshipsQueryHandler,
    GetScholarshipQueryHandler,
    UpdateScholarshipCommandHandler,
    DeleteScholarshipCommandHandler,
    {
      provide: DependencyInjection.SCHOLARSHIP_REPOSITORY,
      useClass: ScholarshipRepositoryImpl,
    },
    ScholarshipDynamoDBRepository,
  ],
  exports: [],
})
export default class ScholarshipModule {}
