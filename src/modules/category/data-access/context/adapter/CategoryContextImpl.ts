import { Inject, Injectable } from '@nestjs/common';
import Pagination from '../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../common/common-domain/DependencyInjection';
import CategoryContext from '../../../domain/application-service/ports/output/context/CategoryContext';
import Category from '../../../domain/domain-core/entity/Category';
import { CategoryRepository } from '../../../domain/application-service/ports/output/repository/CategoryRepository';
import CategoryNotFoundException from '../../../domain/domain-core/exception/CategoryNotFoundException';

@Injectable()
export default class CategoryContextImpl implements CategoryContext {
  private categories: Category[];

  constructor(
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async load(): Promise<Category[]> {
    if (!this.categories) {
      this.categories = await this.categoryRepository.findMany({
        pagination: new Pagination(),
      });
    }
    return this.categories;
  }

  public async forceLoad(): Promise<Category[]> {
    this.categories = await this.categoryRepository.findMany({
      pagination: new Pagination(),
    });
    return this.categories;
  }

  public async findById(param: {
    categoryId: number;
  }): Promise<Category | undefined> {
    await this.load();
    return this.categories.find(
      (category) => category.categoryId === param.categoryId,
    );
  }

  public async findMany(param: {
    pagination?: Pagination;
  }): Promise<Category[]> {
    await this.load();
    let filteredCategories: Category[] = this.categories;
    const { pagination } = param;
    if (pagination && pagination.lastEvaluatedId) {
      filteredCategories = filteredCategories.filter(
        (category) => category.categoryId < pagination.lastEvaluatedId,
      );
    }
    if (pagination && pagination.limit) {
      filteredCategories = filteredCategories.slice(0, pagination.limit);
    }
    return filteredCategories;
  }

  public async refresh(param: { categoryId: number }): Promise<void> {
    const { categoryId } = param;
    try {
      const refreshedCategory: Category =
        await this.categoryRepository.findByIdOrThrow({
          categoryId,
          domainException: new CategoryNotFoundException(),
        });
      this.categories = this.categories.map((category) =>
        category.categoryId === categoryId ? refreshedCategory : category,
      );
    } catch (exception) {
      return;
    }
  }
}
