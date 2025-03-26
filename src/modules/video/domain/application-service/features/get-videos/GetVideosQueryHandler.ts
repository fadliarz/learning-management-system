import { Inject, Injectable } from '@nestjs/common';
import GetVideosQuery from './dto/GetVideosQuery';
import { VideoRepository } from '../../ports/output/repository/VideoRepository';
import Video from '../../../domain-core/entity/Video';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import VideoResponse from '../common/VideoResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class GetVideosQueryHandler {
  constructor(
    @Inject(DependencyInjection.VIDEO_REPOSITORY)
    private readonly videoRepository: VideoRepository,
  ) {}

  public async execute(
    getVideosQuery: GetVideosQuery,
  ): Promise<VideoResponse[]> {
    const videos: Video[] = await this.videoRepository.findMany({
      ...getVideosQuery,
      pagination: strictPlainToClass(Pagination, getVideosQuery),
    });
    return videos.map((video) => strictPlainToClass(VideoResponse, video));
  }
}
