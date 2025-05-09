import { Injectable } from '@nestjs/common';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';
import Scholarship from '../../../domain/domain-core/entity/Scholarship';

@Injectable()
export default class ScholarshipRedisCacheMemory extends RedisCacheMemory<Scholarship> {}
