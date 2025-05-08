import CacheMemory from '../../../../../../../common/common-data-access/cache/CacheMemory';
import Category from '../../../../domain-core/entity/Category';

export default interface CategoryCacheMemory
  extends CacheMemory<number, Category> {}
