import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import Tag from '../../../../domain-core/entity/Tag';

export default interface TagContext {
  load: () => Promise<Tag[]>;
  forceLoad: () => Promise<Tag[]>;
  findById: (param: { tagId: number }) => Promise<Tag | undefined>;
  findMany: (param: { pagination?: Pagination }) => Promise<Tag[]>;
  refresh: (param: { tagId: number }) => Promise<void>;
}
