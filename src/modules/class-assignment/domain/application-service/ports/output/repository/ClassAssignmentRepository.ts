import ClassAssignment from '../../../../domain-core/entity/ClassAssignment';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface ClassAssignmentRepository {
  saveIfNotExistsOrThrow(param: {
    classAssignment: ClassAssignment;
  }): Promise<void>;

  findMany(param: {
    classId: number;
    pagination: Pagination;
  }): Promise<ClassAssignment[]>;

  findByIdOrThrow(param: {
    classId: number;
    assignmentId: number;
  }): Promise<ClassAssignment>;

  saveIfExistsOrThrow(param: {
    classAssignment: ClassAssignment;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    classId: number;
    assignmentId: number;
  }): Promise<void>;
}
