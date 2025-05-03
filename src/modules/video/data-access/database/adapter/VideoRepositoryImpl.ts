import { Injectable } from '@nestjs/common';
import { VideoRepository } from '../../../domain/application-service/ports/output/repository/VideoRepository';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import Video from '../../../domain/domain-core/entity/Video';
import VideoDynamoDBRepository from '../repository/VideoDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import VideoEntity from '../entity/VideoEntity';

@Injectable()
export default class VideoRepositoryImpl implements VideoRepository {
  constructor(
    private readonly videoDynamoDBRepository: VideoDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: { video: Video }): Promise<void> {
    await this.videoDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      videoEntity: strictPlainToClass(VideoEntity, param.video),
    });
  }

  public async findMany(param: {
    lessonId: number;
    pagination: Pagination;
  }): Promise<Video[]> {
    const videoEntities: VideoEntity[] =
      await this.videoDynamoDBRepository.findMany(param);
    return videoEntities.map((videoEntity: VideoEntity) =>
      strictPlainToClass(Video, videoEntity),
    );
  }

  public async findByIdOrThrow(param: {
    lessonId: number;
    videoId: number;
  }): Promise<Video> {
    return strictPlainToClass(
      Video,
      await this.videoDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: { video: Video }): Promise<void> {
    await this.videoDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      videoEntity: strictPlainToClass(VideoEntity, param.video),
    });
  }

  public async updatePositionOrThrow(param: {
    video: Video;
    upperVideo: Video | null;
    lowerVideo: Video | null;
    version: number;
  }): Promise<void> {
    await this.videoDynamoDBRepository.updateVideoPositionOrThrow({
      video: strictPlainToClass(VideoEntity, param.video),
      upperVideo: param.upperVideo
        ? strictPlainToClass(VideoEntity, param.upperVideo)
        : null,
      lowerVideo: param.lowerVideo
        ? strictPlainToClass(VideoEntity, param.lowerVideo)
        : null,
      version: param.version,
    });
  }

  public async deleteIfExistsOrThrow(param: {
    lessonId: number;
    videoId: number;
  }): Promise<void> {
    await this.videoDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
