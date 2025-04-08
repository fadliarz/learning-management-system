import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import Tag from '../../../../domain-core/entity/Tag';

export interface TagRepository {
  saveIfNotExistsOrThrow(param: {
    tag: Tag;
    domainException: DomainException;
  }): Promise<void>;

  findByIdOrThrow(param: {
    tagId: number;
    domainException: DomainException;
  }): Promise<Tag>;

  findMany(param: { pagination: Pagination }): Promise<Tag[]>;

  saveIfExistsOrThrow(param: {
    tag: Tag;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    tagId: number;
    domainException: DomainException;
  }): Promise<void>;
}
