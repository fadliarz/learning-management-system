import Pagination from '../../../../../../../common/common-domain/repository/Pagination';
import Category from '../../../../domain-core/entity/Category';

export default interface CategoryContext {
  load: () => Promise<Category[]>;
  forceLoad: () => Promise<Category[]>;
  findById: (param: { categoryId: number }) => Promise<Category | undefined>;
  findMany: (param: { pagination?: Pagination }) => Promise<Category[]>;
  refresh: (param: { categoryId: number }) => Promise<void>;
}
