import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../../domain/application-service/ports/output/repository/CategoryRepository';
import DomainException from '../../../../../common/common-domain/exception/DomainException';
import Category from '../../../domain/domain-core/entity/Category';
import CategoryDynamoDBRepository from '../repository/CategoryDynamoDBRepository';
import strictPlainToClass from '../../../../../common/common-domain/mapper/strictPlainToClass';
import CategoryEntity from '../entity/CategoryEntity';
import Pagination from '../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class CategoryRepositoryImpl implements CategoryRepository {
  constructor(
    private readonly categoryDynamoDBRepository: CategoryDynamoDBRepository,
  ) {}

  public async saveIfNotExistsOrThrow(param: {
    category: Category;
    domainException: DomainException;
  }): Promise<void> {
    await this.categoryDynamoDBRepository.saveIfNotExistsOrThrow({
      ...param,
      categoryEntity: strictPlainToClass(CategoryEntity, param.category),
    });
  }

  public async findByIdOrThrow(param: {
    categoryId: number;
    domainException: DomainException;
  }): Promise<Category> {
    return strictPlainToClass(
      Category,
      await this.categoryDynamoDBRepository.findByIdOrThrow(param),
    );
  }

  public async findMany(param: {
    pagination: Pagination;
  }): Promise<Category[]> {
    const categoryEntities: CategoryEntity[] =
      await this.categoryDynamoDBRepository.findMany(param);
    return categoryEntities.map((categoryEntity) =>
      strictPlainToClass(Category, categoryEntity),
    );
  }

  async saveIfExistsOrThrow(param: {
    category: Category;
    domainException: DomainException;
  }): Promise<void> {
    await this.categoryDynamoDBRepository.saveIfExistsOrThrow({
      ...param,
      categoryEntity: strictPlainToClass(CategoryEntity, param.category),
    });
  }

  async deleteIfExistsOrThrow(param: {
    categoryId: number;
    domainException: DomainException;
  }): Promise<void> {
    await this.categoryDynamoDBRepository.deleteIfExistsOrThrow(param);
  }
}
