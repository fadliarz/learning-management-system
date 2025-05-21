import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import TagController from './application/rest/TagController';
import ConfigModule from '../ConfigModule';
import CreateTagCommandHandler from './domain/application-service/features/create-tag/CreateTagCommandHandler';
import GetTagsQueryHandler from './domain/application-service/features/get-tags/GetTagsQueryHandler';
import GetTagQueryHandler from './domain/application-service/features/get-tag/GetTagQueryHandler';
import UpdateTagCommandHandler from './domain/application-service/features/update-tag/UpdateTagCommandHandler';
import DeleteTagCommandHandler from './domain/application-service/features/delete-tag/DeleteTagCommandHandler';
import TagContextImpl from './data-access/context/adapter/TagContextImpl';
import TagRedisCacheMemory from './data-access/cache/memory/TagRedisCacheMemory';
import TagCacheMemoryImpl from './data-access/cache/adapter/TagCacheMemoryImpl';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [TagController],
  providers: [
    CreateTagCommandHandler,
    GetTagsQueryHandler,
    GetTagQueryHandler,
    UpdateTagCommandHandler,
    DeleteTagCommandHandler,
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
      provide: DependencyInjection.TAG_CONTEXT,
      useClass: TagContextImpl,
    },
  ],
})
export default class TagModule {}
