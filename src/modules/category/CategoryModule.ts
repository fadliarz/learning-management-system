import { Module } from '@nestjs/common';
import { DependencyInjection } from '../../common/common-domain/DependencyInjection';
import CategoryController from './application/rest/CategoryController';
import CreateCategoryCommandHandler from './domain/application-service/features/create-category/CreateCategoryCommandHandler';
import GetCategoriesQueryHandler from './domain/application-service/features/get-categories/GetCategoriesQueryHandler';
import GetCategoryQueryHandler from './domain/application-service/features/get-category/GetCategoryQueryHandler';
import UpdateCategoryCommandHandler from './domain/application-service/features/update-category/UpdateCategoryCommandHandler';
import DeleteCategoryCommandHandler from './domain/application-service/features/delete-category/DeleteCategoryCommandHandler';
import ConfigModule from '../ConfigModule';
import CategoryCacheMemoryImpl from './data-access/cache/adapter/CategoryCacheMemoryImpl';
import CategoryRedisCacheMemory from './data-access/cache/memory/CategoryRedisCacheMemory';
import CategoryHelper from './domain/application-service/CategoryHelper';
import DataAccessModule from '../DataAccessModule';

@Module({
  imports: [ConfigModule, DataAccessModule],
  controllers: [CategoryController],
  providers: [
    CreateCategoryCommandHandler,
    GetCategoriesQueryHandler,
    GetCategoryQueryHandler,
    UpdateCategoryCommandHandler,
    DeleteCategoryCommandHandler,
    CategoryHelper,
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
    {
      provide: DependencyInjection.CATEGORY_CACHE_MEMORY,
      useClass: CategoryCacheMemoryImpl,
    },
  ],
})
export default class CategoryModule {}
