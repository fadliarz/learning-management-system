import { Inject, Injectable } from '@nestjs/common';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { AttachmentRepository } from '../../ports/output/repository/AttachmentRepository';
import GetAttachmentsQuery from './dto/GetAttachmentsQuery';
import AttachmentResponse from '../common/AttachmentResponse';
import Attachment from '../../../domain-core/entity/Attachment';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetAttachmentsQueryHandler {
  constructor(
    @Inject(DependencyInjection.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  public async execute(
    getAttachmentsQuery: GetAttachmentsQuery,
  ): Promise<AttachmentResponse[]> {
    const attachments: Attachment[] =
      await this.attachmentRepository.findMany(getAttachmentsQuery);
    return attachments.map((attachments) =>
      strictPlainToClass(AttachmentResponse, attachments),
    );
  }
}
