import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import UserAssignment from '../../../../domain-core/entity/UserAssignment';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface UserAssignmentRepository {
  saveIfNotExistsOrThrow(param: {
    userAssignment: UserAssignment;
    domainException: DomainException;
  }): Promise<void>;

  findMany(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<UserAssignment[]>;

  findByIdOrThrow(param: {
    userId: number;
    assignmentId: number;
    domainException: DomainException;
  }): Promise<UserAssignment>;

  saveIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userAssignment: UserAssignment;
    notFoundException: DomainException;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userId: number;
    assignmentId: number;
    notFoundException: DomainException;
    domainException: DomainException;
  }): Promise<void>;
}
