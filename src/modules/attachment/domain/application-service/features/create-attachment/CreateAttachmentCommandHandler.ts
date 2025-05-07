import { Inject, Injectable } from '@nestjs/common';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { AttachmentRepository } from '../../ports/output/repository/AttachmentRepository';
import CreateAttachmentCommand from './dto/CreateAttachmentCommand';
import AttachmentResponse from '../common/AttachmentResponse';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import Attachment from '../../../domain-core/entity/Attachment';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CreateAttachmentCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  public async execute(
    createAttachmentCommand: CreateAttachmentCommand,
  ): Promise<AttachmentResponse> {
    await this.authorizationService.authorizeManageCourse(
      createAttachmentCommand.executor,
    );
    const attachment: Attachment = strictPlainToClass(
      Attachment,
      createAttachmentCommand,
    );
    attachment.create();
    await this.attachmentRepository.saveIfNotExistsOrThrow({
      attachment,
    });
    return strictPlainToClass(AttachmentResponse, attachment);
  }
}
