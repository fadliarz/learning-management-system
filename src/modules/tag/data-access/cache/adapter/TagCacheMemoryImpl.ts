import { Inject, Injectable } from '@nestjs/common';
import TagCacheMemory from '../../../domain/application-service/ports/output/cache/TagCacheMemory';
import CacheMemoryTemplate from '../../../../../common/common-data-access/cache/CacheMemoryTemplate';
import CacheConfig from '../../../../../config/CacheConfig';
import TagRedisCacheMemory from '../memory/TagRedisCacheMemory';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import { TagRepository } from '../../../domain/application-service/ports/output/repository/TagRepository';
import Tag from '../../../domain/domain-core/entity/Tag';

type ResourceId = { tagId: number };
type Value = Tag;
type Index = {};

@Injectable()
export default class TagCacheMemoryImpl
  extends CacheMemoryTemplate<ResourceId, Value, Index>
  implements TagCacheMemory
{
  constructor(
    @Inject(DependencyInjection.TAG_REDIS_CACHE_MEMORY)
    protected tagRedisCacheMemory: TagRedisCacheMemory,
    protected cacheConfig: CacheConfig,
    @Inject(DependencyInjection.TAG_REPOSITORY)
    protected tagRepository: TagRepository,
  ) {
    super(tagRedisCacheMemory, cacheConfig, tagRepository);
  }

  protected resourceIdToKey(resourceId: { tagId: number }): string {
    return `TAG#${resourceId.tagId}`;
  }

  protected keyToResourceId(key: string): ResourceId {
    return { tagId: Number(key.split('TAG#')[1]) };
  }

  protected indexToIndexString(index: Index): string {
    return 'TAG#INDEX';
  }

  protected valueToKey(value: Value): string {
    return `TAG#${value.tagId}`;
  }

  protected valueToIndexString(value: Value): string {
    return 'TAG#INDEX';
  }
}
