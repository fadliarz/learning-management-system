import { Inject, Injectable } from '@nestjs/common';
import CreateTagCommand from './dto/CreateTagCommand';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import TagResponse from '../common/TagResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Tag from '../../../domain-core/entity/Tag';
import TagCacheMemoryImpl from '../../../../data-access/cache/adapter/TagCacheMemoryImpl';

@Injectable()
export default class CreateTagCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
    @Inject(DependencyInjection.TAG_CACHE_MEMORY)
    private readonly tagCacheMemory: TagCacheMemoryImpl,
  ) {}

  public async execute(
    createTagCommand: CreateTagCommand,
  ): Promise<TagResponse> {
    await this.authorizationService.authorizeManageScholarship(
      createTagCommand.executor,
    );
    const tag: Tag = strictPlainToClass(Tag, createTagCommand);
    tag.create();
    await this.tagRepository.saveIfNotExistsOrThrow({
      tag,
    });
    await this.tagCacheMemory.setAndSaveIndex({
      key: { tagId: tag.tagId },
      value: tag,
    });
    return strictPlainToClass(TagResponse, tag);
  }
}
