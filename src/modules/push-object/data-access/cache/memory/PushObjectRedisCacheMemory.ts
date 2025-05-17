import { Injectable } from '@nestjs/common';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';

@Injectable()
export default class PushObjectRedisCacheMemory extends RedisCacheMemory<string> {}
