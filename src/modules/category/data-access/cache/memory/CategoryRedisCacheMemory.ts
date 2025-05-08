import { Injectable } from '@nestjs/common';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';
import Category from '../../../domain/domain-core/entity/Category';

@Injectable()
export default class CategoryRedisCacheMemory extends RedisCacheMemory<
  string,
  Category
> {}
