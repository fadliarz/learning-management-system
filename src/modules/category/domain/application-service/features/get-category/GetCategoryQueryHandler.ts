import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import GetCategoryQuery from './dto/GetCategoryQuery';
import CategoryResponse from '../common/CategoryResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CategoryCacheMemoryImpl from '../../../../data-access/cache/adapter/CategoryCacheMemoryImpl';
import Category from '../../../domain-core/entity/Category';

@Injectable()
export default class GetCategoryQueryHandler {
  constructor(
    @Inject(DependencyInjection.CATEGORY_CACHE_MEMORY)
    private readonly categoryCacheMemory: CategoryCacheMemoryImpl,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    getCategoryQuery: GetCategoryQuery,
  ): Promise<CategoryResponse> {
    const cachedCategory: Category | null = await this.categoryCacheMemory.get(
      getCategoryQuery.categoryId,
    );
    if (cachedCategory)
      return strictPlainToClass(CategoryResponse, cachedCategory);
    const category = await this.categoryRepository.findByIdOrThrow({
      ...getCategoryQuery,
    });
    await this.categoryCacheMemory.setAndSaveIndex({
      key: getCategoryQuery.categoryId,
      value: category,
    });
    return strictPlainToClass(CategoryResponse, category);
  }
}
