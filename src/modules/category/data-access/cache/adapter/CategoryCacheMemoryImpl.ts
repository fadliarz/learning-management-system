import { CacheOptions } from '../../../../../common/common-data-access/cache/CacheOptions';
import { Inject, Injectable } from '@nestjs/common';
import CategoryRedisCacheMemory from '../memory/CategoryRedisCacheMemory';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import CacheConfig from '../../../../../config/CacheConfig';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import CategoryCacheMemory from '../../../domain/application-service/ports/output/cache/CategoryCacheMemory';
import { CategoryRepository } from '../../../domain/application-service/ports/output/repository/CategoryRepository';
import Category from '../../../domain/domain-core/entity/Category';

@Injectable()
export default class CategoryCacheMemoryImpl implements CategoryCacheMemory {
  private readonly INDEX_NAME = 'CATEGORY';

  constructor(
    @Inject(DependencyInjection.CATEGORY_REDIS_CACHE_MEMORY)
    private readonly categoryRedisCacheMemory: CategoryRedisCacheMemory,
    private readonly cacheConfig: CacheConfig,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async get(key: number): Promise<Category | null> {
    return await this.categoryRedisCacheMemory.get(this.transformKey(key));
  }

  public async getKeysByIndex(): Promise<number[]> {
    let keys: string[];
    keys = await this.categoryRedisCacheMemory.getKeysByIndex(this.INDEX_NAME);
    if (keys.length === 0) {
      keys = await this.loadKeysByIndex();
    }
    await this.categoryRedisCacheMemory.setExpiresIfNotSet(
      this.INDEX_NAME,
      this.cacheConfig.DEFAULT_INDEX_TTL_IN_SEC,
    );
    return keys.map((key) => this.revertKey(key));
  }

  public async set(
    key: number,
    value: Category,
    options?: CacheOptions,
  ): Promise<void> {
    await this.categoryRedisCacheMemory.set(this.transformKey(key), value, {
      ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
      ...options,
    });
  }

  public async setAndSaveIndex(param: {
    key: number;
    value: Category;
    options?: CacheOptions;
  }): Promise<void> {
    const { key, value, options } = param;
    await this.categoryRedisCacheMemory.setAndSaveIndex({
      key: this.transformKey(key),
      value,
      options: {
        ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
        ...options,
      },
      index: this.INDEX_NAME,
    });
  }

  public async delete(key: number): Promise<void> {
    await this.categoryRedisCacheMemory.delete(this.transformKey(key));
  }

  public async deleteAndRemoveIndex(key: number): Promise<void> {
    await this.categoryRedisCacheMemory.deleteAndRemoveIndex(
      this.transformKey(key),
      this.INDEX_NAME,
    );
  }

  private transformKey(key: number): string {
    return `${this.INDEX_NAME}#${key}`;
  }

  private revertKey(key: string): number {
    return parseInt(key.replace(`${this.INDEX_NAME}#`, ''));
  }

  private async loadKeysByIndex(): Promise<string[]> {
    const categories: Category[] = await this.categoryRepository.findMany({
      pagination: new Pagination(),
    });
    for (const category of categories) {
      await this.categoryRedisCacheMemory.setAndSaveIndex({
        key: this.transformKey(category.categoryId),
        value: category,
        options: {
          ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
        },
        index: this.INDEX_NAME,
      });
    }
    return await this.categoryRedisCacheMemory.getKeysByIndex(this.INDEX_NAME);
  }
}
