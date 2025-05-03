import { Inject, Injectable } from '@nestjs/common';
import { EnrollmentRepository } from '../../ports/output/repository/EnrollmentRepository';
import DeleteEnrollmentCommand from './dto/DeleteEnrollmentCommand';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class DeleteEnrollmentCommandHandler {
  constructor(
    @Inject(DependencyInjection.ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  public async execute(
    deleteEnrollmentCommand: DeleteEnrollmentCommand,
  ): Promise<void> {
    await this.enrollmentRepository.deleteIfExistsOrThrow({
      ...deleteEnrollmentCommand,
      userId: deleteEnrollmentCommand.executor.userId,
    });
  }
}
