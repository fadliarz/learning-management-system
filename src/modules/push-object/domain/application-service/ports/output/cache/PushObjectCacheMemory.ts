import { CacheOptions } from '../../../../../../../common/common-data-access/cache/CacheOptions';
import PushObject from '../../../../domain-core/entity/PushObject';
import { MonitorDetail } from '../../../../domain-core/MonitorDetail';

type Key = { deviceId: string };
type Value = PushObject;
type Index = { userId: number };

export default interface PushObjectCacheMemory {
  get(key: Key): Promise<Value | null>;

  getKeysByIndex(index: Index): Promise<Key[]>;

  getMonitorRegistration(): Promise<MonitorDetail[]>;

  set(key: Key, value: Value, options?: CacheOptions): Promise<void>;

  setAndSaveIndex(param: {
    key: Key;
    value: Value;
    index?: {};
    options?: CacheOptions;
  }): Promise<void>;

  delete(key: Key): Promise<void>;

  deleteAndRemoveIndex(key: Key, index: Index): Promise<void>;
}
