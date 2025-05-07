import CacheMemory from '../../../../../../../common/common-data-access/cache/CacheMemory';
import Attachment from '../../../../domain-core/entity/Attachment';

export default interface AttachmentCacheMemory
  extends CacheMemory<number, Attachment> {}
