import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeleteTagCommand from './dto/DeleteTagCommand';
import TagNotFoundException from '../../../domain-core/exception/TagNotFoundException';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(deleteTagCommand: DeleteTagCommand): Promise<void> {
    await this.authorizationService.authorizeManageScholarship(
      deleteTagCommand.executor,
    );
    await this.tagRepository.deleteIfExistsOrThrow({
      ...deleteTagCommand,
      domainException: new TagNotFoundException(),
    });
  }
}
