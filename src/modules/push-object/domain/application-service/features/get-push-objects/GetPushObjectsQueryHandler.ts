import PushObjectResponse from '../common/PushObjectResponse';
import { Inject, Injectable } from '@nestjs/common';
import GetPushObjectsQuery from './dto/GetPushObjectsQuery';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import PushObjectCacheMemoryImpl from '../../../../data-access/cache/adapter/PushObjectCacheMemoryImpl';
import PushObject from '../../../domain-core/entity/PushObject';

@Injectable()
export default class GetPushObjectsQueryHandler {
  constructor(
    @Inject(DependencyInjection.PUSH_OBJECT_CACHE_MEMORY)
    private readonly pushObjectCacheMemory: PushObjectCacheMemoryImpl,
  ) {}

  public async execute(
    getPushObjectsQuery: GetPushObjectsQuery,
  ): Promise<PushObjectResponse[]> {
    const resourceIds: { deviceId: string }[] =
      await this.pushObjectCacheMemory.getKeysByIndex(getPushObjectsQuery);
    const pushObjects: PushObject[] = [];
    for (const resourceId of resourceIds) {
      const pushObject: PushObject | null =
        await this.pushObjectCacheMemory.get({
          deviceId: resourceId.deviceId,
        });
      if (pushObject) {
        pushObjects.push(pushObject);
        continue;
      }
      await this.pushObjectCacheMemory.deleteAndRemoveIndex(resourceId, {
        userId: getPushObjectsQuery.userId,
      });
    }
    return pushObjects.map((pushObject) =>
      strictPlainToClass(PushObjectResponse, pushObject),
    );
  }
}
