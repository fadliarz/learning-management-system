import Category from '../../../../domain-core/entity/Category';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface CategoryRepository {
  saveIfNotExistsOrThrow(param: { category: Category }): Promise<void>;

  findById(param: { categoryId: number }): Promise<Category | null>;

  findByIdOrThrow(param: { categoryId: number }): Promise<Category>;

  findMany(param: { pagination: Pagination }): Promise<Category[]>;

  saveIfExistsOrThrow(param: { category: Category }): Promise<void>;

  deleteIfExistsOrThrow(param: { categoryId: number }): Promise<void>;
}
