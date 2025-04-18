import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import CategoryRepositoryImpl from './data-access/database/adapter/CategoryRepositoryImpl';
import CategoryController from './application/rest/CategoryController';
import CreateCategoryCommandHandler from './domain/application-service/features/create-category/CreateCategoryCommandHandler';
import GetCategoriesQueryHandler from './domain/application-service/features/get-categories/GetCategoriesQueryHandler';
import GetCategoryQueryHandler from './domain/application-service/features/get-category/GetCategoryQueryHandler';
import UpdateCategoryCommandHandler from './domain/application-service/features/update-category/UpdateCategoryCommandHandler';
import DeleteCategoryCommandHandler from './domain/application-service/features/delete-category/DeleteCategoryCommandHandler';
import ConfigModule from '../ConfigModule';
import PrivilegeModule from '../privilege/PrivilegeModule';
import CategoryDynamoDBRepository from './data-access/database/repository/CategoryDynamoDBRepository';
import CategoryContextImpl from './data-access/context/adapter/CategoryContextImpl';

@Module({
  imports: [ConfigModule, PrivilegeModule],
  controllers: [CategoryController],
  providers: [
    CreateCategoryCommandHandler,
    GetCategoriesQueryHandler,
    GetCategoryQueryHandler,
    UpdateCategoryCommandHandler,
    DeleteCategoryCommandHandler,
    {
      provide: DependencyInjection.CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
    CategoryDynamoDBRepository,
    {
      provide: DependencyInjection.CATEGORY_CONTEXT,
      useClass: CategoryContextImpl,
    },
  ],
  exports: [
    {
      provide: DependencyInjection.CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
    CategoryDynamoDBRepository,
    {
      provide: DependencyInjection.CATEGORY_CONTEXT,
      useClass: CategoryContextImpl,
    },
  ],
})
export default class CategoryModule {}
