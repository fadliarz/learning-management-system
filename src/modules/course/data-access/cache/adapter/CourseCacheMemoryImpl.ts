import CourseCacheMemory from '../../../domain/application-service/ports/output/cache/CourseCache';
import Course from '../../../domain/domain-core/entity/Course';
import { CacheOptions } from '../../../../../common/common-data-access/cache/CacheOptions';
import { Inject, Injectable } from '@nestjs/common';
import CourseRedisCacheMemory from '../memory/CourseRedisCacheMemory';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import CacheConfig from '../../../../../config/CacheConfig';
import { CourseRepository } from '../../../domain/application-service/ports/output/repository/CourseRepository';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class CourseCacheMemoryImpl implements CourseCacheMemory {
  private readonly INDEX_NAME = 'COURSE';

  constructor(
    @Inject(DependencyInjection.COURSE_REDIS_CACHE_MEMORY)
    private readonly courseRedisCacheMemory: CourseRedisCacheMemory,
    private readonly cacheConfig: CacheConfig,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  public async get(key: number): Promise<Course | null> {
    return await this.courseRedisCacheMemory.get(this.transformKey(key));
  }

  public async getKeysByIndex(): Promise<number[]> {
    let keys: string[];
    keys = await this.courseRedisCacheMemory.getKeysByIndex(this.INDEX_NAME);
    if (keys.length === 0) {
      keys = await this.loadKeysByIndex();
    }
    await this.courseRedisCacheMemory.setExpiresIfNotSet(
      this.INDEX_NAME,
      this.cacheConfig.DEFAULT_INDEX_TTL_IN_SEC,
    );
    return keys.map((key) => this.revertKey(key));
  }

  public async set(
    key: number,
    value: Course,
    options?: CacheOptions,
  ): Promise<void> {
    await this.courseRedisCacheMemory.set(this.transformKey(key), value, {
      ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
      ...options,
    });
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
      options: {
        ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
        ...options,
      },
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

  private async loadKeysByIndex(): Promise<string[]> {
    const courses: Course[] = await this.courseRepository.findMany({
      pagination: new Pagination(),
    });
    for (const course of courses) {
      await this.courseRedisCacheMemory.setAndSaveIndex({
        key: this.transformKey(course.courseId),
        value: course,
        options: {
          ttl: this.cacheConfig.DEFAULT_TTL_IN_SEC,
        },
        index: this.INDEX_NAME,
      });
    }
    return await this.courseRedisCacheMemory.getKeysByIndex(this.INDEX_NAME);
  }
}
