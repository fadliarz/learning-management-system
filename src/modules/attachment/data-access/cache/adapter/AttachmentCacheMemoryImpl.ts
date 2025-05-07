import { CacheOptions } from '../../../../../common/common-data-access/cache/CacheOptions';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import CacheConfig from '../../../../../config/CacheConfig';
import AttachmentRedisCacheMemory from '../memory/AttachmentRedisCacheMemory';
import Attachment from '../../../domain/domain-core/entity/Attachment';
import AttachmentCacheMemory from '../../../domain/application-service/ports/output/cache/AttachmentCacheMemory';

@Injectable()
export default class AttachmentCacheMemoryImpl
  implements AttachmentCacheMemory
{
  private readonly INDEX_NAME = 'ATTACHMENT';

  constructor(
    @Inject(DependencyInjection.ATTACHMENT_REDIS_CACHE_MEMORY)
    private readonly attachmentRedisCacheMemory: AttachmentRedisCacheMemory,
    private readonly cacheConfig: CacheConfig,
  ) {}

  public async get(key: number): Promise<Attachment | null> {
    return await this.attachmentRedisCacheMemory.get(this.transformKey(key));
  }

  public async getKeysByIndex(): Promise<number[]> {
    const keys = await this.attachmentRedisCacheMemory.getKeysByIndex(
      this.INDEX_NAME,
    );
    return keys.map((key) => this.revertKey(key));
  }

  public async set(
    key: number,
    value: Attachment,
    options?: CacheOptions,
  ): Promise<void> {
    await this.attachmentRedisCacheMemory.set(this.transformKey(key), value, {
      ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
      ...options,
    });
  }

  public async setAndSaveIndex(param: {
    key: number;
    value: Attachment;
    options?: CacheOptions;
  }): Promise<void> {
    const { key, value, options } = param;
    await this.attachmentRedisCacheMemory.setAndSaveIndex({
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
    await this.attachmentRedisCacheMemory.delete(this.transformKey(key));
  }

  public async deleteAndRemoveIndex(key: number): Promise<void> {
    await this.attachmentRedisCacheMemory.deleteAndRemoveIndex(
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
}
