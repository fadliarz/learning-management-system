import { Module } from '@nestjs/common';
import CreateVideoCommandHandler from './domain/application-service/features/create-video/CreateVideoCommandHandler';
import GetVideoQueryHandler from './domain/application-service/features/get-video/GetVideoQueryHandler';
import UpdateVideoCommandHandler from './domain/application-service/features/update-video/UpdateVideoCommandHandler';
import DeleteVideoCommandHandler from './domain/application-service/features/delete-video/DeleteVideoCommandHandler';
import GetVideosQueryHandler from './domain/application-service/features/get-videos/GetVideosQueryHandler';
import VideoController from './application/rest/VideoController';
import ConfigModule from '../ConfigModule';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [VideoController],
  providers: [
    CreateVideoCommandHandler,
    GetVideosQueryHandler,
    GetVideoQueryHandler,
    UpdateVideoCommandHandler,
    DeleteVideoCommandHandler,
  ],
  exports: [],
})
export default class VideoModule {}
