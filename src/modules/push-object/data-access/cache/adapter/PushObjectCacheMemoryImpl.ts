import { Inject, Injectable } from '@nestjs/common';
import PushObjectCacheMemory from '../../../domain/application-service/ports/output/cache/PushObjectCacheMemory';
import { CacheOptions } from '../../../../../common/common-data-access/cache/CacheOptions';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';
import CacheConfig from '../../../../../config/CacheConfig';
import PushObject from '../../../domain/domain-core/entity/PushObject';
import { MonitorDetail } from '../../../domain/domain-core/MonitorDetail';
import PushObjectRedisCacheMemory from '../memory/PushObjectRedisCacheMemory';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';

type ResourceId = { deviceId: string };
type Value = PushObject;
type Index = { userId: number };

@Injectable()
export default class PushObjectCacheMemoryImpl
  implements PushObjectCacheMemory
{
  public constructor(
    protected redisCacheMemory: RedisCacheMemory<Value>,
    protected cacheConfig: CacheConfig,
    @Inject(DependencyInjection.PUSH_OBJECT_REDIS_CACHE_MEMORY)
    private readonly pushObjectRedisCacheMemory: PushObjectRedisCacheMemory,
  ) {}

  public async get(resourceId: ResourceId): Promise<Value | null> {
    return await this.redisCacheMemory.get(this.resourceIdToKey(resourceId));
  }

  public async getKeysByIndex(index: Index): Promise<ResourceId[]> {
    const keys: string[] = await this.redisCacheMemory.getKeysByIndex(
      this.indexToIndexString(index),
    );
    await this.redisCacheMemory.setExpiresIfNotSet(
      this.indexToIndexString(index),
      this.cacheConfig.DEFAULT_PUSH_OBJECT_ARRAY_TTL_IN_SEC,
    );
    return keys.map((key) => this.keyToResourceId(key));
  }

  public async getMonitorRegistration(): Promise<MonitorDetail[]> {
    return await this.pushObjectRedisCacheMemory.getMonitorRegistration();
  }

  public async set(
    key: ResourceId,
    value: Value,
    options?: CacheOptions,
  ): Promise<void> {
    await this.redisCacheMemory.set(this.resourceIdToKey(key), value, {
      ttl: this.cacheConfig.DEFAULT_PUSH_OBJECT_TTL_IN_SEC,
      ...options,
    });
  }

  public async setAndSaveIndex(param: {
    key: ResourceId;
    value: Value;
    options?: CacheOptions;
  }): Promise<void> {
    const { key, value, options } = param;
    await this.redisCacheMemory.setAndSaveIndex({
      key: this.resourceIdToKey(key),
      value,
      options: {
        ttl: this.cacheConfig.DEFAULT_PUSH_OBJECT_TTL_IN_SEC,
        ...options,
      },
      index: this.valueToIndexString(value),
    });
  }

  public async delete(key: ResourceId): Promise<void> {
    await this.redisCacheMemory.delete(this.resourceIdToKey(key));
  }

  public async deleteAndRemoveIndex(
    key: ResourceId,
    index: Index,
  ): Promise<void> {
    await this.redisCacheMemory.deleteAndRemoveIndex(
      this.resourceIdToKey(key),
      this.indexToIndexString(index),
    );
  }

  protected resourceIdToKey(resourceId: { deviceId: string }): string {
    return `PUSH-OBJECT#${resourceId.deviceId}`;
  }

  protected keyToResourceId(key: string): ResourceId {
    return { deviceId: key.split('PUSH-OBJECT#')[1] };
  }

  protected indexToIndexString(index: Index): string {
    return `PUSH-OBJECT#${index.userId}`;
  }

  protected valueToIndexString(value: Value): string {
    return `PUSH-OBJECT#${value.userId}`;
  }
}
