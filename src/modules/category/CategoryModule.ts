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
import CategoryCacheMemoryImpl from './data-access/cache/adapter/CategoryCacheMemoryImpl';
import CategoryRedisCacheMemory from './data-access/cache/memory/CategoryRedisCacheMemory';
import CategoryHelper from './domain/application-service/CategoryHelper';

@Module({
  imports: [ConfigModule, PrivilegeModule],
  controllers: [CategoryController],
  providers: [
    CreateCategoryCommandHandler,
    GetCategoriesQueryHandler,
    GetCategoryQueryHandler,
    UpdateCategoryCommandHandler,
    DeleteCategoryCommandHandler,
    CategoryHelper,
    {
      provide: DependencyInjection.CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
    CategoryDynamoDBRepository,
    {
      provide: DependencyInjection.CATEGORY_CACHE_MEMORY,
      useClass: CategoryCacheMemoryImpl,
    },
    {
      provide: DependencyInjection.CATEGORY_REDIS_CACHE_MEMORY,
      useClass: CategoryRedisCacheMemory,
    },
  ],
  exports: [
    CategoryDynamoDBRepository,
    {
      provide: DependencyInjection.CATEGORY_REPOSITORY,
      useClass: CategoryRepositoryImpl,
    },
    {
      provide: DependencyInjection.CATEGORY_CACHE_MEMORY,
      useClass: CategoryCacheMemoryImpl,
    },
  ],
})
export default class CategoryModule {}
