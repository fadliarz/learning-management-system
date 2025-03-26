import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import UpdateVideoPositionCommand from './dto/UpdateVideoPositionCommand';
import { VideoRepository } from '../../ports/output/repository/VideoRepository';
import Video from '../../../domain-core/entity/Video';
import VideoRearrangedException from '../../../domain-core/exception/VideoRearrangedException';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateVideoPositionCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.VIDEO_REPOSITORY)
    private readonly videoRepository: VideoRepository,
  ) {}

  public async execute(
    updateVideoPositionCommand: UpdateVideoPositionCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      updateVideoPositionCommand.executor,
    );
    const video: Video = this.updateVideoPositionCommandToVideo(
      updateVideoPositionCommand,
    );
    const upperVideo: Video | null =
      this.updateVideoPositionCommandToUpperVideo(updateVideoPositionCommand);
    const lowerVideo: Video | null =
      this.updateVideoPositionCommandToLowerVideo(updateVideoPositionCommand);
    await this.videoRepository.updatePositionOrThrow({
      video,
      upperVideo,
      lowerVideo,
      version: updateVideoPositionCommand.version,
      domainException: new VideoRearrangedException(),
    });
  }

  public updateVideoPositionCommandToVideo(
    updateVideoPositionCommand: UpdateVideoPositionCommand,
  ): Video {
    const video: Video = new Video();
    video.videoId = updateVideoPositionCommand.videoId;
    video.courseId = updateVideoPositionCommand.courseId;
    video.lessonId = updateVideoPositionCommand.lessonId;
    return video;
  }

  public updateVideoPositionCommandToUpperVideo(
    updateVideoPositionCommand: UpdateVideoPositionCommand,
  ): Video | null {
    if (
      !updateVideoPositionCommand.upperVideoId ||
      !updateVideoPositionCommand.upperVideoPosition
    )
      return null;
    const video: Video = new Video();
    video.videoId = updateVideoPositionCommand.upperVideoId;
    video.courseId = updateVideoPositionCommand.courseId;
    video.lessonId = updateVideoPositionCommand.lessonId;
    video.position = updateVideoPositionCommand.upperVideoPosition;
    return video;
  }

  public updateVideoPositionCommandToLowerVideo(
    updateVideoPositionCommand: UpdateVideoPositionCommand,
  ): Video | null {
    if (
      !updateVideoPositionCommand.lowerVideoId ||
      !updateVideoPositionCommand.lowerVideoPosition
    )
      return null;
    const video: Video = new Video();
    video.videoId = updateVideoPositionCommand.lowerVideoId;
    video.courseId = updateVideoPositionCommand.courseId;
    video.lessonId = updateVideoPositionCommand.lessonId;
    video.position = updateVideoPositionCommand.lowerVideoPosition;
    return video;
  }
}
