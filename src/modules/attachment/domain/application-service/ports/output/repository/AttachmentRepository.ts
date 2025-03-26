import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Attachment from '../../../../domain-core/entity/Attachment';

export interface AttachmentRepository {
  saveIfNotExistsOrThrow(param: {
    attachment: Attachment;
    domainException: DomainException;
  }): Promise<void>;

  findMany(param: { lessonId: number }): Promise<Attachment[]>;

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
