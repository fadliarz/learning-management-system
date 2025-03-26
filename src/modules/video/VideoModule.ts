import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import CreateVideoCommandHandler from './domain/application-service/features/create-video/CreateVideoCommandHandler';
import GetVideoQueryHandler from './domain/application-service/features/get-video/GetVideoQueryHandler';
import UpdateVideoCommandHandler from './domain/application-service/features/update-video/UpdateVideoCommandHandler';
import DeleteVideoCommandHandler from './domain/application-service/features/delete-video/DeleteVideoCommandHandler';
import GetVideosQueryHandler from './domain/application-service/features/get-videos/GetVideosQueryHandler';
import VideoRepositoryImpl from './data-access/database/adapter/VideoRepositoryImpl';
import VideoController from './application/rest/VideoController';
import ConfigModule from '../ConfigModule';
import UserModule from '../user/UserModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import VideoDynamoDBRepository from './data-access/database/repository/VideoDynamoDBRepository';
import LessonModule from '../lesson/LessonModule';

@Module({
  imports: [ConfigModule, UserModule, PrivilegeModule, LessonModule],
  controllers: [VideoController],
  providers: [
    CreateVideoCommandHandler,
    GetVideosQueryHandler,
    GetVideoQueryHandler,
    UpdateVideoCommandHandler,
    DeleteVideoCommandHandler,
    {
      provide: DependencyInjection.VIDEO_REPOSITORY,
      useClass: VideoRepositoryImpl,
    },
    VideoDynamoDBRepository,
  ],
  exports: [],
})
export default class VideoModule {
}
