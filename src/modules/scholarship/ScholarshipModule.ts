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
import RemoveScholarshipTagCommandHandler from './domain/application-service/features/remove-tag/RemoveScholarshipTagCommandHandler';
import ScholarshipRedisCacheMemory from './data-access/cache/memory/ScholarshipRedisCacheMemory';
import ScholarshipCacheMemoryImpl from './data-access/cache/adapter/ScholarshipCacheMemoryImpl';

@Module({
  imports: [ConfigModule, PrivilegeModule, TagModule],
  controllers: [ScholarshipController],
  providers: [
    CreateScholarshipCommandHandler,
    AddScholarshipTagCommandHandler,
    RemoveScholarshipTagCommandHandler,
    GetScholarshipsQueryHandler,
    GetScholarshipQueryHandler,
    UpdateScholarshipCommandHandler,
    DeleteScholarshipCommandHandler,
    ScholarshipDynamoDBRepository,
    {
      provide: DependencyInjection.SCHOLARSHIP_REPOSITORY,
      useClass: ScholarshipRepositoryImpl,
    },
    {
      provide: DependencyInjection.SCHOLARSHIP_CONTEXT,
      useClass: ScholarshipContextImpl,
    },
    {
      provide: DependencyInjection.SCHOLARSHIP_REDIS_CACHE_MEMORY,
      useClass: ScholarshipRedisCacheMemory,
    },
    {
      provide: DependencyInjection.SCHOLARSHIP_CACHE_MEMORY,
      useClass: ScholarshipCacheMemoryImpl,
    },
  ],
  exports: [],
})
export default class ScholarshipModule {}
