import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import AddCourseCategoryCommand from './dto/AddCourseCategoryCommand';
import { CategoryRepository } from '../../../../../category/domain/application-service/ports/output/repository/CategoryRepository';
import CategoryNotFoundException from '../../../../../category/domain/domain-core/exception/CategoryNotFoundException';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';

@Injectable()
export default class AddCourseCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async execute(
    addCourseCategoryCommand: AddCourseCategoryCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      addCourseCategoryCommand.executor,
    );
    await this.categoryRepository.findByIdOrThrow({
      categoryId: addCourseCategoryCommand.categoryId,
      domainException: new CategoryNotFoundException(),
    });
    await this.courseRepository.addCategoryIfNotExistsOrIgnore(
      addCourseCategoryCommand,
    );
  }
}
