import UserAssignment from '../../../../domain-core/entity/UserAssignment';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface UserAssignmentRepository {
  saveIfNotExistsOrThrow(param: {
    userAssignment: UserAssignment;
  }): Promise<void>;

  findMany(param: {
    userId: number;
    pagination: Pagination;
    rangeQuery?: {
      id?: {
        upper?: number;
        lower?: number;
      };
    };
  }): Promise<UserAssignment[]>;

  findByIdOrThrow(param: {
    userId: number;
    assignmentId: number;
  }): Promise<UserAssignment>;

  saveIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userAssignment: UserAssignment;
  }): Promise<void>;

  deleteIfExistsAndAssignmentIsPersonalOrThrow(param: {
    userId: number;
    assignmentId: number;
  }): Promise<void>;
}
