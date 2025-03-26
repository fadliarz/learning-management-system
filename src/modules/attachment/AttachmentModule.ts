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

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule],
  controllers: [AttachmentController],
  providers: [
    CreateAttachmentCommandHandler,
    GetAttachmentsQueryHandler,
    GetAttachmentQueryHandler,
    UpdateAttachmentCommandHandler,
    DeleteAttachmentCommandHandler,
    {
      provide: DependencyInjection.ATTACHMENT_REPOSITORY,
      useClass: AttachmentRepositoryImpl,
    },
    AttachmentDynamoDBRepository,
  ],
  exports: [],
})
export default class AttachmentModule {}
