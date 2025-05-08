import Course from '../../../../domain-core/entity/Course';
import CacheMemory from '../../../../../../../common/common-data-access/cache/CacheMemory';

export default interface CourseCacheMemory
  extends CacheMemory<number, Course> {}
