import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import GetCategoryQuery from './dto/GetCategoryQuery';
import CategoryResponse from '../common/CategoryResponse';
import CategoryNotFoundException from '../../../domain-core/exception/CategoryNotFoundException';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetCategoryQueryHandler {
  constructor(
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    getCategoryQuery: GetCategoryQuery,
  ): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findByIdOrThrow({
      ...getCategoryQuery,
      domainException: new CategoryNotFoundException(),
    });
    return strictPlainToClass(CategoryResponse, category);
  }
}
