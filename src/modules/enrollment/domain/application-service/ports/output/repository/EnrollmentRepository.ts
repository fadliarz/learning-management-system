import Enrollment from '../../../../domain-core/entity/Enrollment';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface EnrollmentRepository {
  saveIfNotExistsOrThrow(param: { enrollment: Enrollment }): Promise<void>;

  findManyByUserId(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<Enrollment[]>;

  findById(param: {
    userId: number;
    classId: number;
  }): Promise<Enrollment | null>;

  deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
  }): Promise<void>;
}
