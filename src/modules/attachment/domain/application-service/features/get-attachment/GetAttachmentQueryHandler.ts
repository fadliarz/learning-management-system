import { Inject, Injectable } from '@nestjs/common';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { AttachmentRepository } from '../../ports/output/repository/AttachmentRepository';
import GetAttachmentQuery from './dto/GetAttachmentQuery';
import AttachmentResponse from '../common/AttachmentResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetAttachmentQueryHandler {
  constructor(
    @Inject(DependencyInjection.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  public async execute(
    getAttachmentQuery: GetAttachmentQuery,
  ): Promise<AttachmentResponse> {
    return strictPlainToClass(
      AttachmentResponse,
      await this.attachmentRepository.findByIdOrThrow({
        ...getAttachmentQuery,
      }),
    );
  }
}
