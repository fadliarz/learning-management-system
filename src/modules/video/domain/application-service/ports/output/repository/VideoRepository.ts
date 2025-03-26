import Video from '../../../../domain-core/entity/Video';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface VideoRepository {
  saveIfNotExistsOrThrow(param: {
    video: Video;
    domainException: DomainException;
  }): Promise<void>;

  findMany(param: {
    lessonId: number;
    pagination: Pagination;
  }): Promise<Video[]>;

  findByIdOrThrow(param: {
    lessonId: number;
    videoId: number;
    domainException: DomainException;
  }): Promise<Video>;

  saveIfExistsOrThrow(param: {
    video: Video;
    domainException: DomainException;
  }): Promise<void>;

  updatePositionOrThrow(param: {
    video: Video;
    upperVideo: Video | null;
    lowerVideo: Video | null;
    version: number;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    lessonId: number;
    videoId: number;
    domainException: DomainException;
  }): Promise<void>;
}
