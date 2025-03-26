import Instructor from '../../../domain-core/entity/Instructor';
import Pagination from '../../../../../../common/common-domain/repository/Pagination';
import DomainException from '../../../../../../common/common-domain/exception/DomainException';

export default interface InstructorRepository {
  saveIfNotExistsOrThrow(param: {
    instructor: Instructor;
    domainException: DomainException;
  }): Promise<void>;

  findManyByUserId(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<Instructor[]>;

  findManyByClassId(param: {
    classId: number;
    pagination: Pagination;
  }): Promise<Instructor[]>;

  deleteIfExistsOrThrow(param: {
    userId: number;
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void>;
}
