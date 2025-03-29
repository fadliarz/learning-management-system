import GetInstructorsQuery from './dto/GetInstructorsQuery';
import Instructor from '../../../domain-core/entity/Instructor';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import { Inject } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import InstructorRepository from '../../ports/output/InstructorRepository';
import InstructorResponse from '../common/InstructorResponse';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import UserRepository from '../../../../../user/domain/application-service/ports/output/repository/UserRepository';
import UserNotFoundException from '../../../../../user/domain/domain-core/exception/UserNotFoundException';
import User from '../../../../../user/domain/domain-core/entity/User';

export default class GetInstructorsQueryHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
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

    const instructorResponses: InstructorResponse[] = [];
    for (const instructor of instructors) {
      try {
        const instructorResponse: InstructorResponse = strictPlainToClass(
          InstructorResponse,
          instructor,
        );
        const user: User = await this.userRepository.findByIdOrThrow({
          userId: instructor.userId,
          domainException: new UserNotFoundException(),
        });
        instructorResponse.name = user.name;
        instructorResponse.NIM = user.email.split('@')[0];
        instructorResponses.push(instructorResponse);
      } catch (exception) {
        if (exception instanceof UserNotFoundException) {
          continue;
        }
        throw exception;
      }
    }
    return instructorResponses;
  }
}
