import Enrollment from '../../../../domain-core/entity/Enrollment';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface EnrollmentRepository {
  saveIfNotExistsOrThrow(param: {
    enrollment: Enrollment;
    domainException: DomainException;
  }): Promise<void>;

  findManyByUserId(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<Enrollment[]>;

  deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void>;
}
