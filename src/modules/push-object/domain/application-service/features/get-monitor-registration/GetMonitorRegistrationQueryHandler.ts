import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import PushObjectCacheMemoryImpl from '../../../../data-access/cache/adapter/PushObjectCacheMemoryImpl';
import { MonitorDetail } from '../../../domain-core/MonitorDetail';

@Injectable()
export default class GetMonitorRegistrationQueryHandler {
  constructor(
    @Inject(DependencyInjection.PUSH_OBJECT_CACHE_MEMORY)
    private readonly pushObjectCacheMemory: PushObjectCacheMemoryImpl,
  ) {}

  public async execute(): Promise<MonitorDetail[]> {
    return await this.pushObjectCacheMemory.getMonitorRegistration();
  }
}
