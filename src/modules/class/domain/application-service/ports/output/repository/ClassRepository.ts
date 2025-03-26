import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Class from '../../../../domain-core/entity/Class';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface ClassRepository {
  saveIfNotExistsOrThrow(param: {
    courseClass: Class;
    domainException: DomainException;
  }): Promise<void>;

  findByIdOrThrow(param: {
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<Class>;

  findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<Class[]>;

  saveIfExistsOrThrow(param: {
    courseClass: Class;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    classId: number;
    domainException: DomainException;
  }): Promise<void>;
}
