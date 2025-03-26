import CategoryResponse from '../common/CategoryResponse';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import GetCategoriesQuery from './dto/GetCategoriesQuery';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetCategoriesQueryHandler {
  constructor(
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    getCategoriesQuery: GetCategoriesQuery,
  ): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepository.findMany({
      pagination: strictPlainToClass(Pagination, getCategoriesQuery),
    });
    return categories.map((category) =>
      strictPlainToClass(CategoryResponse, category),
    );
  }
}
