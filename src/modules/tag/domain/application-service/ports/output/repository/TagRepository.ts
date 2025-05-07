import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import Tag from '../../../../domain-core/entity/Tag';

export interface TagRepository {
  saveIfNotExistsOrThrow(param: { tag: Tag }): Promise<void>;

  findByIdOrThrow(param: { tagId: number }): Promise<Tag>;

  findMany(param: { pagination: Pagination }): Promise<Tag[]>;

  saveIfExistsOrThrow(param: { tag: Tag }): Promise<void>;

  deleteIfExistsOrThrow(param: { tagId: number }): Promise<void>;
}
