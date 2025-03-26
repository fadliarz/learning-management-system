import { ClassAssignmentRepository } from '../../ports/output/repository/ClassAssignmentRepository';
import GetClassAssignmentQuery from './dto/GetClassAssignmentQuery';
import ClassAssignmentResponse from '../common/ClassAssignmentResponse';
import ClassAssignment from '../../../domain-core/entity/ClassAssignment';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import ClassAssignmentNotFoundException from '../../../domain-core/exception/ClassAssignmentNotFoundException';
import { Inject, Injectable } from '@nestjs/common';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';

@Injectable()
export default class GetClassAssignmentQueryHandler {
  constructor(
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
  ) {}

  public async execute(
    getClassAssignmentQuery: GetClassAssignmentQuery,
  ): Promise<ClassAssignmentResponse> {
    const classAssignment: ClassAssignment =
      await this.classAssignmentRepository.findByIdOrThrow({
        ...getClassAssignmentQuery,
        domainException: new ClassAssignmentNotFoundException(),
      });
    return strictPlainToClass(ClassAssignmentResponse, classAssignment);
  }
}
