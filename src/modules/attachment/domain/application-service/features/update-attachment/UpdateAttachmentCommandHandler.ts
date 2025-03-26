import { Inject, Injectable } from '@nestjs/common';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { AttachmentRepository } from '../../ports/output/repository/AttachmentRepository';
import UpdateAttachmentCommand from './dto/UpdateAttachmentCommand';
import AttachmentResponse from '../common/AttachmentResponse';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Attachment from '../../../domain-core/entity/Attachment';
import AttachmentNotFoundException from '../../../domain-core/exception/AttachmentNotFoundException';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateAttachmentCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  public async execute(
    updateAttachmentCommand: UpdateAttachmentCommand,
  ): Promise<AttachmentResponse> {
    await this.authorizationService.authorizeManageCourse(
      updateAttachmentCommand.executor,
    );
    const attachment: Attachment = strictPlainToClass(
      Attachment,
      updateAttachmentCommand,
    );
    attachment.update();
    await this.attachmentRepository.saveIfExistsOrThrow({
      ...updateAttachmentCommand,
      attachment,
      domainException: new AttachmentNotFoundException(),
    });
    return strictPlainToClass(AttachmentResponse, attachment);
  }
}
