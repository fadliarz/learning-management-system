import { Inject, Injectable } from '@nestjs/common';
import ScholarshipCacheMemory from '../../../domain/application-service/ports/output/cache/ScholarshipCacheMemory';
import CacheMemoryTemplate from '../../../../../common/common-data-access/cache/CacheMemoryTemplate';
import Scholarship from '../../../domain/domain-core/entity/Scholarship';
import CacheConfig from '../../../../../config/CacheConfig';
import ScholarshipRedisCacheMemory from '../memory/ScholarshipRedisCacheMemory';
import { ScholarshipRepository } from '../../../domain/application-service/ports/output/repository/ScholarshipRepository';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';

type ResourceId = { scholarshipId: number };
type Value = Scholarship;
type Index = {};

@Injectable()
export default class ScholarshipCacheMemoryImpl
  extends CacheMemoryTemplate<ResourceId, Value, Index>
  implements ScholarshipCacheMemory
{
  constructor(
    @Inject(DependencyInjection.SCHOLARSHIP_REDIS_CACHE_MEMORY)
    protected scholarshipRedisCacheMemory: ScholarshipRedisCacheMemory,
    protected cacheConfig: CacheConfig,
    @Inject(DependencyInjection.SCHOLARSHIP_REPOSITORY)
    protected scholarshipRepository: ScholarshipRepository,
  ) {
    super(scholarshipRedisCacheMemory, cacheConfig, scholarshipRepository);
  }

  protected resourceIdToKey(resourceId: { scholarshipId: number }): string {
    return `SCHOLARSHIP#${resourceId.scholarshipId}`;
  }

  protected keyToResourceId(key: string): ResourceId {
    return { scholarshipId: Number(key.split('SCHOLARSHIP#')[1]) };
  }

  protected indexToIndexString(index: Index): string {
    return 'SCHOLARSHIP#INDEX';
  }

  protected valueToKey(value: Value): string {
    return `SCHOLARSHIP#${value.scholarshipId}`;
  }

  protected valueToIndexString(value: Value): string {
    return 'SCHOLARSHIP#INDEX';
  }
}
