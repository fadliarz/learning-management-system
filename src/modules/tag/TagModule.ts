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

@Module({
  imports: [ConfigModule, PrivilegeModule],
  controllers: [TagController],
  providers: [
    CreateTagCommandHandler,
    GetTagsQueryHandler,
    GetTagQueryHandler,
    UpdateTagCommandHandler,
    DeleteTagCommandHandler,
    {
      provide: DependencyInjection.TAG_REPOSITORY,
      useClass: TagRepositoryImpl,
    },
    TagDynamoDBRepository,
  ],
  exports: [
    {
      provide: DependencyInjection.TAG_REPOSITORY,
      useClass: TagRepositoryImpl,
    },
    TagDynamoDBRepository,
  ],
})
export default class TagModule {}
