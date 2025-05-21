import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import ScholarshipController from './application/rest/ScholarshipController';
import CreateScholarshipCommandHandler from './domain/application-service/features/create-scholarship/CreateScholarshipCommandHandler';
import GetScholarshipsQueryHandler from './domain/application-service/features/get-scholarships/GetScholarshipsQueryHandler';
import GetScholarshipQueryHandler from './domain/application-service/features/get-scholarship/GetScholarshipQueryHandler';
import UpdateScholarshipCommandHandler from './domain/application-service/features/update-scholarship/UpdateScholarshipCommandHandler';
import DeleteScholarshipCommandHandler from './domain/application-service/features/delete-scholarship/DeleteScholarshipCommandHandler';
import ConfigModule from '../ConfigModule';
import AddScholarshipTagCommandHandler from './domain/application-service/features/add-tag/AddScholarshipTagCommandHandler';
import TagModule from '../tag/TagModule';
import RemoveScholarshipTagCommandHandler from './domain/application-service/features/remove-tag/RemoveScholarshipTagCommandHandler';
import ScholarshipRedisCacheMemory from './data-access/cache/memory/ScholarshipRedisCacheMemory';
import ScholarshipCacheMemoryImpl from './data-access/cache/adapter/ScholarshipCacheMemoryImpl';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, TagModule, DataAccessModule],
  controllers: [ScholarshipController],
  providers: [
    CreateScholarshipCommandHandler,
    AddScholarshipTagCommandHandler,
    RemoveScholarshipTagCommandHandler,
    GetScholarshipsQueryHandler,
    GetScholarshipQueryHandler,
    UpdateScholarshipCommandHandler,
    DeleteScholarshipCommandHandler,
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
