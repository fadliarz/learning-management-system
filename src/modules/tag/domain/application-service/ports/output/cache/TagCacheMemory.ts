import CacheMemory from '../../../../../../../common/common-data-access/cache/CacheMemory';
import Tag from '../../../../domain-core/entity/Tag';

export default interface TagCacheMemory
  extends CacheMemory<{ tagId: number }, Tag> {}
