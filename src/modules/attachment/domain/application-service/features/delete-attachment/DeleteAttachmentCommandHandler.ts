import { Inject, Injectable } from '@nestjs/common';
import { AttachmentRepository } from '../../ports/output/repository/AttachmentRepository';
import DeleteAttachmentCommand from './dto/DeleteAttachmentCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AttachmentNotFoundException from '../../../domain-core/exception/AttachmentNotFoundException';

@Injectable()
export default class DeleteAttachmentCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepository,
  ) {}

  public async execute(
    deleteAttachmentCommand: DeleteAttachmentCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      deleteAttachmentCommand.executor,
    );
    await this.attachmentRepository.deleteIfExistsOrThrow({
      ...deleteAttachmentCommand,
      domainException: new AttachmentNotFoundException(),
    });
  }
}
