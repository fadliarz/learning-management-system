import { Injectable, NotImplementedException } from '@nestjs/common';
import RedisCacheMemory from './redis/RedisCacheMemory';
import CacheConfig from '../../../config/CacheConfig';
import Pagination from '../../common-domain/repository/Pagination';
import { CacheOptions } from './CacheOptions';

@Injectable()
export default abstract class CacheMemoryTemplate<
  ResourceId extends object,
  Value extends string | number | object,
  Index extends object,
> {
  protected constructor(
    protected redisCacheMemory: RedisCacheMemory<Value>,
    protected cacheConfig: CacheConfig,
    protected repository: {
      findById: (param: ResourceId) => Promise<Value | null>;
      findMany: (param: { pagination: Pagination }) => Promise<Value[]>;
    },
  ) {}

  public async get(resourceId: ResourceId): Promise<Value | null> {
    return await this.redisCacheMemory.get(this.resourceIdToKey(resourceId));
  }

  public async getKeysByIndex(index: Index): Promise<ResourceId[]> {
    let keys: string[];
    keys = await this.redisCacheMemory.getKeysByIndex(
      this.indexToIndexString(index),
    );
    if (keys.length === 0) {
      keys = await this.loadKeysByIndex(index);
    }
    await this.redisCacheMemory.setExpiresIfNotSet(
      this.indexToIndexString(index),
      this.cacheConfig.DEFAULT_INDEX_TTL_IN_SEC,
    );
    return keys.map((key) => this.keyToResourceId(key));
  }

  public async set(
    key: ResourceId,
    value: Value,
    options?: CacheOptions,
  ): Promise<void> {
    await this.redisCacheMemory.set(this.resourceIdToKey(key), value, {
      ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
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
        ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
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

  private async loadKeysByIndex(index: Index): Promise<string[]> {
    const values: Value[] = await this.repository.findMany({
      pagination: new Pagination(),
    });
    for (const value of values) {
      await this.redisCacheMemory.setAndSaveIndex({
        key: this.valueToKey(value),
        value,
        options: {
          ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
        },
        index: this.indexToIndexString(index),
      });
    }
    return await this.redisCacheMemory.getKeysByIndex(
      this.indexToIndexString(index),
    );
  }

  protected resourceIdToKey(resourceId: ResourceId): string {
    throw new NotImplementedException();
  }

  protected keyToResourceId(key: string): ResourceId {
    throw new NotImplementedException();
  }

  protected indexToIndexString(index: Index): string {
    throw new NotImplementedException();
  }

  protected valueToKey(value: Value): string {
    throw new NotImplementedException();
  }

  protected valueToIndexString(value: Value): string {
    throw new NotImplementedException();
  }
}
