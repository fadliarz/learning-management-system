import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Attachment from '../../../../domain-core/entity/Attachment';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface AttachmentRepository {
  saveIfNotExistsOrThrow(param: {
    attachment: Attachment;
    domainException: DomainException;
  }): Promise<void>;

  findMany(param: {
    lessonId: number;
    pagination: Pagination;
  }): Promise<Attachment[]>;

  findByIdOrThrow(param: {
    lessonId: number;
    attachmentId: number;
    domainException: DomainException;
  }): Promise<Attachment>;

  saveIfExistsOrThrow(param: {
    attachment: Attachment;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    lessonId: number;
    attachmentId: number;
    domainException: DomainException;
  }): Promise<void>;
}
