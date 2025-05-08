import CategoryResponse from '../common/CategoryResponse';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import GetCategoriesQuery from './dto/GetCategoriesQuery';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CategoryCacheMemoryImpl from '../../../../data-access/cache/adapter/CategoryCacheMemoryImpl';
import Category from '../../../domain-core/entity/Category';
import CategoryHelper from '../../CategoryHelper';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class GetCategoriesQueryHandler {
  constructor(
    @Inject(DependencyInjection.CATEGORY_CACHE_MEMORY)
    private readonly categoryCacheMemory: CategoryCacheMemoryImpl,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    getCategoriesQuery: GetCategoriesQuery,
  ): Promise<CategoryResponse[]> {
    const categoryIds: number[] =
      await this.categoryCacheMemory.getKeysByIndex();
    let categories: Category[] = [];
    for (const categoryId of categoryIds) {
      let category: Category | null =
        await this.categoryCacheMemory.get(categoryId);
      if (category) {
        categories.push(category);
        continue;
      }
      category = await this.categoryRepository.findById({ categoryId });
      if (category) {
        categories.push(category);
        continue;
      }
      await this.categoryCacheMemory.deleteAndRemoveIndex(categoryId);
    }
    categories = CategoryHelper.paginate(
      categories,
      strictPlainToClass(Pagination, getCategoriesQuery),
    );
    return categories.map((category) =>
      strictPlainToClass(CategoryResponse, category),
    );
  }
}
