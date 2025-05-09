import { CacheOptions } from './CacheOptions';

export default interface CacheMemory<
  Key extends string | number | object,
  Value extends string | number | object,
> {
  get(key: Key): Promise<Value | null>;

  getKeysByIndex(index?: {}): Promise<Key[]>;

  set(key: Key, value: Value, options?: CacheOptions): Promise<void>;

  setAndSaveIndex(param: {
    key: Key;
    value: Value;
    index?: {};
    options?: CacheOptions;
  }): Promise<void>;

  delete(key: Key): Promise<void>;

  deleteAndRemoveIndex(key: Key, index: {}): Promise<void>;
}
