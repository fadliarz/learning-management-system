import { TagRepository } from '../../ports/output/repository/TagRepository';
import { Inject, Injectable } from '@nestjs/common';
import UpdateTagCommand from './dto/UpdateTagCommand';
import TagResponse from '../common/TagResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Tag from '../../../domain-core/entity/Tag';
import TagCacheMemoryImpl from '../../../../data-access/cache/adapter/TagCacheMemoryImpl';

@Injectable()
export default class UpdateTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
    @Inject(DependencyInjection.TAG_CACHE_MEMORY)
    private readonly tagCacheMemory: TagCacheMemoryImpl,
  ) {}

  public async execute(
    updateTagCommand: UpdateTagCommand,
  ): Promise<TagResponse> {
    await this.authorizationService.authorizeManageScholarship(
      updateTagCommand.executor,
    );
    const tag: Tag = strictPlainToClass(Tag, updateTagCommand);
    await this.tagRepository.saveIfExistsOrThrow({
      tag,
    });
    const updatedTag: Tag | null = await this.tagRepository.findById({
      tagId: tag.tagId,
    });
    if (updatedTag) {
      await this.tagCacheMemory.setAndSaveIndex({
        key: { tagId: tag.tagId },
        value: updatedTag,
      });
    }
    if (!updatedTag) {
      await this.tagCacheMemory.deleteAndRemoveIndex({ tagId: tag.tagId }, {});
    }
    return strictPlainToClass(TagResponse, tag);
  }
}
