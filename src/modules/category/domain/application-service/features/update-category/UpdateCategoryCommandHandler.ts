import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import { Inject, Injectable } from '@nestjs/common';
import UpdateCategoryCommand from './dto/UpdateCategoryCommand';
import CategoryResponse from '../common/CategoryResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Category from '../../../domain-core/entity/Category';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class UpdateCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    updateCategoryCommand: UpdateCategoryCommand,
  ): Promise<CategoryResponse> {
    await this.authorizationService.authorizeManageCourse(
      updateCategoryCommand.executor,
    );
    const category = strictPlainToClass(Category, updateCategoryCommand);
    await this.categoryRepository.saveIfExistsOrThrow({
      category,
    });
    return strictPlainToClass(CategoryResponse, category);
  }
}
