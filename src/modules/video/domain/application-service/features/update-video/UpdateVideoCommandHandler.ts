import { Inject, Injectable } from '@nestjs/common';
import UpdateVideoCommand from './dto/UpdateVideoCommand';
import Video from '../../../domain-core/entity/Video';
import { VideoRepository } from '../../ports/output/repository/VideoRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import VideoResponse from '../common/VideoResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';

@Injectable()
export default class UpdateVideoCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.VIDEO_REPOSITORY)
    private readonly videoRepository: VideoRepository,
  ) {}

  public async execute(
    updateVideoCommand: UpdateVideoCommand,
  ): Promise<VideoResponse> {
    await this.authorizationService.authorizeManageCourse(
      updateVideoCommand.executor,
    );
    const video: Video = strictPlainToClass(Video, updateVideoCommand);
    video.update();
    await this.videoRepository.saveIfExistsOrThrow({
      video,
    });
    return strictPlainToClass(VideoResponse, video);
  }
}
