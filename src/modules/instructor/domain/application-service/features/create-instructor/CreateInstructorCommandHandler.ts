import { Inject, Injectable } from '@nestjs/common';
import AuthorizationService from '../../../../../../common/common-domain/features/AuthorizationService';
import InstructorRepository from '../../ports/output/InstructorRepository';
import InstructorResponse from '../common/InstructorResponse';
import CreateInstructorCommand from './dto/CreateInstructorCommand';
import Instructor from '../../../domain-core/entity/Instructor';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import UserRepository from '../../../../../user/domain/application-service/ports/output/repository/UserRepository';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import User from '../../../../../user/domain/domain-core/entity/User';
import UserNotFoundException from '../../../../../user/domain/domain-core/exception/UserNotFoundException';

@Injectable()
export default class CreateInstructorCommandHandler {
  constructor(
    private readonly authorizationService: AuthorizationService,
    @Inject(DependencyInjection.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(DependencyInjection.INSTRUCTOR_REPOSITORY)
    private readonly instructorRepository: InstructorRepository,
  ) {}

  public async execute(
    createInstructorCommand: CreateInstructorCommand,
  ): Promise<InstructorResponse> {
    await this.authorizationService.authorizeManageCourse(
      createInstructorCommand.executor,
    );
    const user: User = await this.userRepository.findByIdOrThrow({
      userId: createInstructorCommand.userId,
      domainException: new UserNotFoundException(),
    });
    const instructor: Instructor = strictPlainToClass(
      Instructor,
      createInstructorCommand,
    );
    instructor.create(user.userId);
    await this.instructorRepository.saveIfNotExistsOrThrow({
      instructor,
    });
    return strictPlainToClass(InstructorResponse, instructor);
  }
}
