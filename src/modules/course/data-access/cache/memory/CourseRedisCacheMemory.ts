import { Injectable } from '@nestjs/common';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';
import Course from '../../../domain/domain-core/entity/Course';

@Injectable()
export default class CourseRedisCacheMemory extends RedisCacheMemory<
  string,
  Course
> {}
