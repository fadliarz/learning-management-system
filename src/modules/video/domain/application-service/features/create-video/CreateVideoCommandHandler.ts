import { Inject, Injectable } from '@nestjs/common';
import CreateVideoCommand from './dto/CreateVideoCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Video from '../../../domain-core/entity/Video';
import { VideoRepository } from '../../ports/output/repository/VideoRepository';
import VideoResponse from '../common/VideoResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CreateVideoCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.VIDEO_REPOSITORY)
    private readonly videoRepository: VideoRepository,
  ) {}

  public async execute(
    createVideoCommand: CreateVideoCommand,
  ): Promise<VideoResponse> {
    await this.authorizationService.authorizeManageCourse(
      createVideoCommand.executor,
    );
    const video: Video = strictPlainToClass(Video, createVideoCommand);
    video.create();
    await this.videoRepository.saveIfNotExistsOrThrow({
      video,
      domainException: new DomainException(),
    });
    return strictPlainToClass(VideoResponse, video);
  }
}
