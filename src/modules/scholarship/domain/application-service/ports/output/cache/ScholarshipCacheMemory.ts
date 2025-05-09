import CacheMemory from '../../../../../../../common/common-data-access/cache/CacheMemory';
import Scholarship from '../../../../domain-core/entity/Scholarship';

export default interface ScholarshipCacheMemory
  extends CacheMemory<{ scholarshipId: number }, Scholarship> {}
