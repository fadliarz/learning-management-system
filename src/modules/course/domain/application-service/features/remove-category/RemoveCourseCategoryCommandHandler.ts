import { CourseRepository } from '../../ports/output/repository/CourseRepository';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import RemoveCourseCategoryCommand from './dto/RemoveCourseCategoryCommand';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import CourseContext from '../../ports/output/context/CourseContext';

@Injectable()
export default class RemoveCourseCategoryCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(DependencyInjection.COURSE_CONTEXT)
    private readonly courseContext: CourseContext,
  ) {}

  public async execute(
    removeCourseCategoryCommand: RemoveCourseCategoryCommand,
  ): Promise<void> {
    await this.authorizationService.authorizeManageCourse(
      removeCourseCategoryCommand.executor,
    );
    await this.courseRepository.removeCategoryIfExistsOrIgnore(
      removeCourseCategoryCommand,
    );
    await this.courseContext.forceLoad();
  }
}
