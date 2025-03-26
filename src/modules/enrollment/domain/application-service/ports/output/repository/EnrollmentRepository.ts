import Enrollment from '../../../../domain-core/entity/Enrollment';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';

export interface EnrollmentRepository {
  saveIfNotExistsOrThrow(param: {
    enrollment: Enrollment;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void>;
}
