import { Inject, Injectable } from '@nestjs/common';
import { UserAssignmentRepository } from '../../ports/output/repository/UserAssignmentRepository';
import CreateUserAssignmentCommand from './dto/CreateUserAssignmentCommand';
import UserAssignmentResponse from '../common/UserAssignmentResponse';
import UserAssignment from '../../../domain-core/entity/UserAssignment';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class CreateUserAssignmentCommandHandler {
  constructor(
    @Inject(DependencyInjection.USER_ASSIGNMENT_REPOSITORY)
    private readonly userAssignmentRepository: UserAssignmentRepository,
  ) {}

  public async execute(
    userAssignmentCommand: CreateUserAssignmentCommand,
  ): Promise<UserAssignmentResponse> {
    const userAssignment: UserAssignment = strictPlainToClass(
      UserAssignment,
      userAssignmentCommand,
    );
    userAssignment.create();
    await this.userAssignmentRepository.saveIfNotExistsOrThrow({
      userAssignment,
      domainException: new DomainException(),
    });
    return strictPlainToClass(UserAssignmentResponse, userAssignment);
  }
}
