import GetInstructorsQuery from './dto/GetInstructorsQuery';
import Instructor from '../../../domain-core/entity/Instructor';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import InstructorRepository from '../../ports/output/InstructorRepository';
import InstructorResponse from '../common/InstructorResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

export default class GetInstructorsQueryHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
  ) {}

  public async getInstructors(
    getInstructorsQuery: GetInstructorsQuery,
  ): Promise<InstructorResponse[]> {
    await this.authorizationService.authorizeManageCourse(
      getInstructorsQuery.executor,
    );
    const instructors: Instructor[] =
      await this.instructorRepository.findManyByClassId({
        ...getInstructorsQuery,
        pagination: strictPlainToClass(Pagination, getInstructorsQuery),
      });
    return instructors.map((instructor) =>
      strictPlainToClass(InstructorResponse, instructor),
    );
  }
}
