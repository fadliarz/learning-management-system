import Class from '../../../../domain-core/entity/Class';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface ClassRepository {
  saveIfNotExistsOrThrow(param: { courseClass: Class }): Promise<void>;

  findByIdOrThrow(param: { courseId: number; classId: number }): Promise<Class>;

  findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<Class[]>;

  saveIfExistsOrThrow(param: { courseClass: Class }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    classId: number;
  }): Promise<void>;
}
