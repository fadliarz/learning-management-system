import TagResponse from '../common/TagResponse';
import { Inject, Injectable } from '@nestjs/common';
import { TagRepository } from '../../ports/output/repository/TagRepository';
import GetTagsQuery from './dto/GetTagsQuery';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import TagCacheMemoryImpl from '../../../../data-access/cache/adapter/TagCacheMemoryImpl';
import Tag from '../../../domain-core/entity/Tag';
import TagHelper from '../../TagHelper';

@Injectable()
export default class GetTagsQueryHandler {
  constructor(
    @Inject(DependencyInjection.TAG_CACHE_MEMORY)
    private readonly tagCacheMemory: TagCacheMemoryImpl,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    private readonly tagRepository: TagRepository,
  ) {}

  public async execute(getTagsQuery: GetTagsQuery): Promise<TagResponse[]> {
    const resourceIds: { tagId: number }[] =
      await this.tagCacheMemory.getKeysByIndex({});
    let tags: Tag[] = [];
    for (const resourceId of resourceIds) {
      let tag: Tag | null = await this.tagCacheMemory.get({
        tagId: resourceId.tagId,
      });
      if (tag) {
        tags.push(tag);
        continue;
      }
      tag = await this.tagRepository.findById({ tagId: resourceId.tagId });
      if (tag) {
        tags.push(tag);
        continue;
      }
      await this.tagCacheMemory.deleteAndRemoveIndex(
        { tagId: resourceId.tagId },
        {},
      );
    }
    tags = TagHelper.paginate(
      tags,
      strictPlainToClass(Pagination, getTagsQuery),
    );
    return tags.map((tag) => strictPlainToClass(TagResponse, tag));
  }
}
