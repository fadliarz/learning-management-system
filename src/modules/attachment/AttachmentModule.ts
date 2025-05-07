import { Module } from '@nestjs/common';
import AttachmentController from './application/rest/AttachmentController';
import CreateAttachmentCommandHandler from './domain/application-service/features/create-attachment/CreateAttachmentCommandHandler';
import GetAttachmentsQueryHandler from './domain/application-service/features/get-attachments/GetAttachmentsQueryHandler';
import UpdateAttachmentCommandHandler from './domain/application-service/features/update-attachment/UpdateAttachmentCommandHandler';
import DeleteAttachmentCommandHandler from './domain/application-service/features/delete-attachment/DeleteAttachmentCommandHandler';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import AttachmentRepositoryImpl from './data-access/repository/adapter/AttachmentRepositoryImpl';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import GetAttachmentQueryHandler from './domain/application-service/features/get-attachment/GetAttachmentQueryHandler';
import AttachmentDynamoDBRepository from './data-access/repository/repository/AttachmentDynamoDBRepository';
import AttachmentCacheMemoryImpl from './data-access/cache/adapter/AttachmentCacheMemoryImpl';
import AttachmentRedisCacheMemory from './data-access/cache/memory/AttachmentRedisCacheMemory';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule],
  controllers: [AttachmentController],
  providers: [
    CreateAttachmentCommandHandler,
    GetAttachmentsQueryHandler,
    GetAttachmentQueryHandler,
    UpdateAttachmentCommandHandler,
    DeleteAttachmentCommandHandler,
    AttachmentDynamoDBRepository,
    {
      provide: DependencyInjection.ATTACHMENT_REPOSITORY,
      useClass: AttachmentRepositoryImpl,
    },
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
