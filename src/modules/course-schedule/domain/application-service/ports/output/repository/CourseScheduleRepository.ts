import CourseSchedule from '../../../../domain-core/entity/CourseSchedule';
import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default interface CourseScheduleRepository {
  saveIfNotExistsOrThrow(param: {
    courseSchedule: CourseSchedule;
    domainException: DomainException;
  }): Promise<void>;

  findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<CourseSchedule[]>;

  findByIdOrThrow(param: {
    courseId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<CourseSchedule>;

  saveIfExistsOrThrow(param: {
    courseSchedule: CourseSchedule;
    domainException: DomainException;
  }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<void>;
}
