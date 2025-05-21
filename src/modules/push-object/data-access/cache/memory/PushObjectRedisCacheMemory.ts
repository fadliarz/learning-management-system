import { Injectable } from '@nestjs/common';
import RedisCacheMemory from '../../../../../common/common-data-access/cache/redis/RedisCacheMemory';
import User from '../../../../user/domain/domain-core/entity/User';
import UserNotFoundException from '../../../../user/domain/domain-core/exception/UserNotFoundException';
import InternalServerException from '../../../../../common/common-domain/exception/InternalServerException';
import { MonitorDetail } from '../../../domain/domain-core/MonitorDetail';

@Injectable()
export default class PushObjectRedisCacheMemory extends RedisCacheMemory<string> {
  public async getMonitorRegistration(): Promise<MonitorDetail[]> {
    const keys: number[] = [];
    let cursor = '0';
    do {
      const reply = await this.redis.scan(
        cursor,
        'MATCH',
        `PUSH-OBJECT#*`,
        'COUNT',
        100,
      );
      cursor = reply[0];
      const batchKeys = reply[1];
      if (batchKeys.length > 0) {
        for (const batchKey of batchKeys) {
          const userId: number = Number(batchKey.split('#')[1]);
          if (!isNaN(userId)) {
            keys.push(userId);
          }
        }
      }
    } while (cursor !== '0');
    const details: MonitorDetail[] = [];
    for (const key of keys) {
      try {
        const user: User = await this.userRepository.findByIdOrThrow({
          userId: key,
        });
        details.push({
          NIM: user.email.split('@')[0],
          name: user.name,
          numberOfDevice: (await this.getKeysByIndex(`PUSH-OBJECT#${key}`))
            .length,
        });
      } catch (exception) {
        if (exception instanceof UserNotFoundException) continue;
        throw new InternalServerException({ throwable: exception });
      }
    }
    return details;
  }
}
