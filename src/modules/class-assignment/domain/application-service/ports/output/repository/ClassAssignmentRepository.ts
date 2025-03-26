import ClassAssignment from '../../../../domain-core/entity/ClassAssignment';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface ClassAssignmentRepository {
  saveIfNotExistsOrThrow(param: {
    classAssignment: ClassAssignment;
    domainException: DomainException;
  }): Promise<void>;

  findMany(param: {
    classId: number;
    pagination: Pagination;
  }): Promise<ClassAssignment[]>;

  findByIdOrThrow(param: {
    classId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<ClassAssignment>;

  saveIfExistsOrThrow(param: {
    classAssignment: ClassAssignment;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    classId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<void>;
}
