import { Inject, Injectable } from '@nestjs/common';
import CreatePushObjectCommand from './dto/CreatePushObjectCommand';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import PushObjectResponse from '../common/PushObjectResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import PushObject from '../../../domain-core/entity/PushObject';
import PushObjectCacheMemoryImpl from '../../../../data-access/cache/adapter/PushObjectCacheMemoryImpl';

@Injectable()
export default class CreatePushObjectCommandHandler {
  constructor(
    @Inject(DependencyInjection.PUSH_OBJECT_CACHE_MEMORY)
    private readonly pushObjectCacheMemory: PushObjectCacheMemoryImpl,
  ) {}

  public async execute(
    createPushObjectCommand: CreatePushObjectCommand,
  ): Promise<PushObjectResponse> {
    const pushObject: PushObject = strictPlainToClass(
      PushObject,
      createPushObjectCommand,
    );
    await this.pushObjectCacheMemory.setAndSaveIndex({
      key: { deviceId: pushObject.deviceId },
      value: pushObject,
    });
    return strictPlainToClass(PushObjectResponse, pushObject);
  }
}
