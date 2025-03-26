import { ClassAssignmentRepository } from '../../ports/output/repository/ClassAssignmentRepository';
import ClassAssignmentResponse from '../common/ClassAssignmentResponse';
import ClassAssignment from '../../../domain-core/entity/ClassAssignment';
import strictPlainToClass from '../../../../../../common/common-domain/mapper/strictPlainToClass';
import { Inject, Injectable } from '@nestjs/common';
import GetClassAssignmentsQuery from './dto/GetClassAssignmentsQuery';
import { DependencyInjection } from '../../../../../../common/common-domain/DependencyInjection';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';

@Injectable()
export default class GetClassAssignmentsQueryHandler {
  constructor(
    @Inject(DependencyInjection.CLASS_ASSIGNMENT_REPOSITORY)
    private readonly classAssignmentRepository: ClassAssignmentRepository,
  ) {}

  public async execute(
    getClassAssignmentsQuery: GetClassAssignmentsQuery,
  ): Promise<ClassAssignmentResponse[]> {
    const classAssignments: ClassAssignment[] =
      await this.classAssignmentRepository.findMany({
        ...getClassAssignmentsQuery,
        pagination: strictPlainToClass(Pagination, getClassAssignmentsQuery),
      });
    return classAssignments.map((classAssignment) =>
      strictPlainToClass(ClassAssignmentResponse, classAssignment),
    );
  }
}
