import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import GetTagQuery from './dto/GetTagQuery';
import TagResponse from '../common/TagResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import TagCacheMemoryImpl from '../../../../data-access/cache/adapter/TagCacheMemoryImpl';
import Tag from '../../../domain-core/entity/Tag';

@Injectable()
export default class GetTagQueryHandler {
  constructor(
    @Inject(DependencyInjection.TAG_CACHE_MEMORY)
    private readonly tagCacheMemory: TagCacheMemoryImpl,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(getTagQuery: GetTagQuery): Promise<TagResponse> {
    const cachedTag: Tag | null = await this.tagCacheMemory.get({
      tagId: getTagQuery.tagId,
    });
    if (cachedTag) return strictPlainToClass(TagResponse, cachedTag);
    const tag = await this.tagRepository.findByIdOrThrow({
      ...getTagQuery,
    });
    await this.tagCacheMemory.setAndSaveIndex({
      key: { tagId: getTagQuery.tagId },
      value: tag,
    });
    return strictPlainToClass(TagResponse, tag);
  }
}
