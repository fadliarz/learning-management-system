import { Injectable } from '@nestjs/common';
import Pagination from '../../../../common/common-domain/repository/Pagination';
import Category from '../domain-core/entity/Category';

@Injectable()
export default class CategoryHelper {
  public static paginate(categories: Category[], pagination?: Pagination) {
    let filteredCategories: Category[] = categories;
    if (pagination?.lastEvaluatedId) {
      filteredCategories = filteredCategories.filter(
        (category) => category.categoryId < pagination.lastEvaluatedId,
      );
    }
    if (pagination?.limit) {
      filteredCategories = filteredCategories.slice(0, pagination.limit);
    }
    return filteredCategories;
  }
}
