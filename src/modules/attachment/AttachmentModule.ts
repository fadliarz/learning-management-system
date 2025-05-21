import { Module } from '@nestjs/common';
import AttachmentController from './application/rest/AttachmentController';
import CreateAttachmentCommandHandler from './domain/application-service/features/create-attachment/CreateAttachmentCommandHandler';
import GetAttachmentsQueryHandler from './domain/application-service/features/get-attachments/GetAttachmentsQueryHandler';
import UpdateAttachmentCommandHandler from './domain/application-service/features/update-attachment/UpdateAttachmentCommandHandler';
import DeleteAttachmentCommandHandler from './domain/application-service/features/delete-attachment/DeleteAttachmentCommandHandler';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import ConfigModule from '../ConfigModule';
import GetAttachmentQueryHandler from './domain/application-service/features/get-attachment/GetAttachmentQueryHandler';
import AttachmentCacheMemoryImpl from './data-access/cache/adapter/AttachmentCacheMemoryImpl';
import AttachmentRedisCacheMemory from './data-access/cache/memory/AttachmentRedisCacheMemory';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [AttachmentController],
  providers: [
    CreateAttachmentCommandHandler,
    GetAttachmentsQueryHandler,
    GetAttachmentQueryHandler,
    UpdateAttachmentCommandHandler,
    DeleteAttachmentCommandHandler,
    {
      provide: DependencyInjection.ATTACHMENT_REDIS_CACHE_MEMORY,
      useClass: AttachmentRedisCacheMemory,
    },
    {
      provide: DependencyInjection.ATTACHMENT_CACHE_MEMORY,
      useClass: AttachmentCacheMemoryImpl,
    },
  ],
  exports: [],
})
export default class AttachmentModule {}
