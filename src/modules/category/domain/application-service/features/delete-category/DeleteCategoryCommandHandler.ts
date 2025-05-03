import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeleteCategoryCommand from './dto/DeleteCategoryCommand';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    deleteCategoryCommand: DeleteCategoryCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCategory(
      deleteCategoryCommand.executor,
    );
    await this.categoryRepository.deleteIfExistsOrThrow({
      ...deleteCategoryCommand,
    });
  }
}
