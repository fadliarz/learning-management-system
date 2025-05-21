import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import PushObjectController from './application/rest/PushObjectController';
import ConfigModule from '../ConfigModule';
import PushObjectRedisCacheMemory from './data-access/cache/memory/PushObjectRedisCacheMemory';
import PushObjectCacheMemoryImpl from './data-access/cache/adapter/PushObjectCacheMemoryImpl';
import CreatePushObjectCommandHandler from './domain/application-service/features/create-push-object/CreatePushObjectCommandHandler';
import GetPushObjectsQueryHandler from './domain/application-service/features/get-push-objects/GetPushObjectsQueryHandler';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [PushObjectController],
  providers: [
    CreatePushObjectCommandHandler,
    GetPushObjectsQueryHandler,
    {
      provide: DependencyInjection.PUSH_OBJECT_REDIS_CACHE_MEMORY,
      useClass: PushObjectRedisCacheMemory,
    },
    {
      provide: DependencyInjection.PUSH_OBJECT_CACHE_MEMORY,
      useClass: PushObjectCacheMemoryImpl,
    },
  ],
  exports: [],
})
export default class PushObjectModule {}
