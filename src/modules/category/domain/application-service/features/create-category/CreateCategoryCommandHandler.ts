import { Inject, Injectable } from '@nestjs/common';
import CreateCategoryCommand from './dto/CreateCategoryCommand';
import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import Category from '../../../domain-core/entity/Category';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import CategoryResponse from '../common/CategoryResponse';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CategoryTitleAlreadyExistsException from '../../../domain-core/exception/CategoryTitleAlreadyExistsException';

@Injectable()
export default class CreateCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    createCategoryCommand: CreateCategoryCommand,
  ): Promise<CategoryResponse> {
    await this.authorizationService.authorizeManageCategory(
      createCategoryCommand.executor,
    );
    const category: Category = strictPlainToClass(
      Category,
      createCategoryCommand,
    );
    category.create();
    await this.categoryRepository.saveIfNotExistsOrThrow({
      category,
      domainException: new CategoryTitleAlreadyExistsException(),
    });
    return strictPlainToClass(CategoryResponse, category);
  }
}
