import CourseCacheMemory from '../../../domain/application-service/ports/output/cache/CourseCache';
import Course from '../../../domain/domain-core/entity/Course';
import { CacheOptions } from '../../../../../common/common-data-access/cache/CacheOptions';
import { Inject, Injectable } from '@nestjs/common';
import CourseRedisCacheMemory from '../memory/CourseRedisCacheMemory';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CourseCacheMemoryImpl implements CourseCacheMemory {
  private readonly INDEX_NAME = 'COURSE';

  constructor(
    @Inject(DependencyInjection.COURSE_REDIS_CACHE_MEMORY)
    private readonly courseRedisCacheMemory: CourseRedisCacheMemory,
  ) {}

  public async get(key: number): Promise<Course | null> {
    return await this.courseRedisCacheMemory.get(this.transformKey(key));
  }

  public async getKeysByIndex(): Promise<number[]> {
    const keys = await this.courseRedisCacheMemory.getKeysByIndex(
      this.INDEX_NAME,
    );
    return keys.map((key) => this.revertKey(key));
  }

  public async set(
    key: number,
    value: Course,
    options?: CacheOptions,
  ): Promise<void> {
    await this.courseRedisCacheMemory.set(
      this.transformKey(key),
      value,
      options,
    );
  }

  public async setAndSaveIndex(param: {
    key: number;
    value: Course;
    options?: CacheOptions;
  }): Promise<void> {
    const { key, value, options } = param;
    await this.courseRedisCacheMemory.setAndSaveIndex({
      key: this.transformKey(key),
      value,
      options,
      index: this.INDEX_NAME,
    });
  }

  public async delete(key: number): Promise<void> {
    await this.courseRedisCacheMemory.delete(this.transformKey(key));
  }

  public async deleteAndRemoveIndex(key: number): Promise<void> {
    await this.courseRedisCacheMemory.deleteAndRemoveIndex(
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
