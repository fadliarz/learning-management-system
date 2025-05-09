import { Injectable } from '@nestjs/common';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';
import Tag from '../../../domain/domain-core/entity/Tag';

@Injectable()
export default class TagRedisCacheMemory extends RedisCacheMemory<Tag> {}
