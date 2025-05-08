import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../ports/output/repository/CategoryRepository';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import DeleteCategoryCommand from './dto/DeleteCategoryCommand';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import CategoryCacheMemoryImpl from '../../../../data-access/cache/adapter/CategoryCacheMemoryImpl';

@Injectable()
export default class DeleteCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(DependencyInjection.CATEGORY_CACHE_MEMORY)
    private readonly categoryCacheMemory: CategoryCacheMemoryImpl,
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
    await this.categoryCacheMemory.deleteAndRemoveIndex(
      deleteCategoryCommand.categoryId,
    );
  }
}
