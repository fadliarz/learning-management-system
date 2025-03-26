import Category from '../../../../domain-core/entity/Category';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface CategoryRepository {
  saveIfNotExistsOrThrow(param: {
    category: Category;
    domainException: DomainException;
  }): Promise<void>;

  findByIdOrThrow(param: {
    categoryId: number;
    domainException: DomainException;
  }): Promise<Category>;

  findMany(param: { pagination: Pagination }): Promise<Category[]>;

  saveIfExistsOrThrow(param: {
    category: Category;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    categoryId: number;
    domainException: DomainException;
  }): Promise<void>;
}
