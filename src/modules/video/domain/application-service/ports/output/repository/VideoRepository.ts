import Video from '../../../../domain-core/entity/Video';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface VideoRepository {
  saveIfNotExistsOrThrow(param: { video: Video }): Promise<void>;

  findMany(param: {
    lessonId: number;
    pagination: Pagination;
  }): Promise<Video[]>;

  findByIdOrThrow(param: { lessonId: number; videoId: number }): Promise<Video>;

  saveIfExistsOrThrow(param: { video: Video }): Promise<void>;

  updatePositionOrThrow(param: {
    video: Video;
    upperVideo: Video | null;
    lowerVideo: Video | null;
    version: number;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    lessonId: number;
    videoId: number;
  }): Promise<void>;
}
