import { Injectable } from '@nestjs/common';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';
import Attachment from '../../../domain/domain-core/entity/Attachment';

@Injectable()
export default class AttachmentRedisCacheMemory extends RedisCacheMemory<
  string,
  Attachment
> {}
