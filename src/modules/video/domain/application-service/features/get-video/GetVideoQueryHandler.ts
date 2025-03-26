import { Inject, Injectable } from '@nestjs/common';
import { VideoRepository } from '../../ports/output/repository/VideoRepository';
import GetVideoQuery from './dto/GetVideoQuery';
import VideoResponse from '../common/VideoResponse';
import Video from '../../../domain-core/entity/Video';
import VideoNotFoundException from '../../../domain-core/exception/VideoNotFoundException';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetVideoQueryHandler {
  constructor(
    @Inject(DependencyInjection.VIDEO_REPOSITORY)
    private readonly videoRepository: VideoRepository,
  ) {}

  public async execute(getVideoQuery: GetVideoQuery): Promise<VideoResponse> {
    const video: Video = await this.videoRepository.findByIdOrThrow({
      ...getVideoQuery,
      domainException: new VideoNotFoundException(),
    });
    return strictPlainToClass(VideoResponse, video);
  }
}
