import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import TagRepositoryImpl from './data-access/database/adapter/TagRepositoryImpl';
import TagController from './application/rest/TagController';
import ConfigModule from '../ConfigModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import TagDynamoDBRepository from './data-access/database/repository/TagDynamoDBRepository';
import CreateTagCommandHandler from './domain/application-service/features/create-tag/CreateTagCommandHandler';
import GetTagsQueryHandler from './domain/application-service/features/get-tags/GetTagsQueryHandler';
import GetTagQueryHandler from './domain/application-service/features/get-tag/GetTagQueryHandler';
import UpdateTagCommandHandler from './domain/application-service/features/update-tag/UpdateTagCommandHandler';
import DeleteTagCommandHandler from './domain/application-service/features/delete-tag/DeleteTagCommandHandler';
import TagContextImpl from './data-access/context/adapter/TagContextImpl';
import TagRedisCacheMemory from './data-access/cache/memory/TagRedisCacheMemory';
import TagCacheMemoryImpl from './data-access/cache/adapter/TagCacheMemoryImpl';

@Module({
  imports: [ConfigModule, PrivilegeModule],
  controllers: [TagController],
  providers: [
    CreateTagCommandHandler,
    GetTagsQueryHandler,
    GetTagQueryHandler,
    UpdateTagCommandHandler,
    DeleteTagCommandHandler,
    TagDynamoDBRepository,
    {
      provide: DependencyInjection.TAG_REPOSITORY,
      useClass: TagRepositoryImpl,
    },
    {
      provide: DependencyInjection.TAG_CONTEXT,
      useClass: TagContextImpl,
    },
    {
      provide: DependencyInjection.TAG_REDIS_CACHE_MEMORY,
      useClass: TagRedisCacheMemory,
    },
    {
      provide: DependencyInjection.TAG_CACHE_MEMORY,
      useClass: TagCacheMemoryImpl,
    },
  ],
  exports: [
    {
      provide: DependencyInjection.TAG_REPOSITORY,
      useClass: TagRepositoryImpl,
    },
    TagDynamoDBRepository,
    {
      provide: DependencyInjection.TAG_CONTEXT,
      useClass: TagContextImpl,
    },
  ],
})
export default class TagModule {}
