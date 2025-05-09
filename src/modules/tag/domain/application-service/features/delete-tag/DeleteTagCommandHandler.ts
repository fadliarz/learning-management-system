import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeleteTagCommand from './dto/DeleteTagCommand';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import TagCacheMemoryImpl from '../../../../data-access/cache/adapter/TagCacheMemoryImpl';

@Injectable()
export default class DeleteTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
    @Inject(DependencyInjection.TAG_CACHE_MEMORY)
    private readonly tagCacheMemory: TagCacheMemoryImpl,
  ) {}

  public async execute(deleteTagCommand: DeleteTagCommand): Promise<void> {
    await this.authorizationService.authorizeManageScholarship(
      deleteTagCommand.executor,
    );
    await this.tagRepository.deleteIfExistsOrThrow({
      ...deleteTagCommand,
    });
    await this.tagCacheMemory.deleteAndRemoveIndex(
      {
        tagId: deleteTagCommand.tagId,
      },
      {},
    );
  }
}
