import DomainException from '../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import { AttachmentRepository } from '../../../domain/application-service/ports/output/repository/AttachmentRepository';
import { Injectable } from '@nestjs/common';
import Attachment from '../../../domain/domain-core/entity/Attachment';
import AttachmentDynamoDBRepository from '../repository/AttachmentDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import AttachmentEntity from '../entity/AttachmentEntity';

@Injectable()
export default class AttachmentRepositoryImpl implements AttachmentRepository {
  constructor(
    private readonly attachmentDynamoDBRepository: AttachmentDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    attachment: Attachment;
    domainException: DomainException;
  }): Promise<void> {
    await this.attachmentDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      attachmentEntity: strictPlainToClass(AttachmentEntity, param.attachment),
    });
  }

  public async findMany(param: {
    lessonId: number;
    pagination: Pagination;
  }): Promise<Attachment[]> {
    const attachmentEntities: AttachmentEntity[] =
      await this.attachmentDynamoDBRepository.findMany(param);
    return attachmentEntities.map((attachmentEntity) =>
      strictPlainToClass(Attachment, attachmentEntity),
    );
  }

  public async findByIdOrThrow(param: {
    lessonId: number;
    attachmentId: number;
    domainException: DomainException;
  }): Promise<Attachment> {
    return strictPlainToClass(
      Attachment,
      await this.attachmentDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async saveIfExistsOrThrow(param: {
    attachment: Attachment;
    domainException: DomainException;
  }): Promise<void> {
    await this.attachmentDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      attachmentEntity: strictPlainToClass(AttachmentEntity, param.attachment),
    });
  }

  public async deleteIfExistsOrThrow(param: {
    courseId: number;
    lessonId: number;
    attachmentId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.attachmentDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
