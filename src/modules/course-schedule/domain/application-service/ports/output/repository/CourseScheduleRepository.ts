import CourseSchedule from '../../../../domain-core/entity/CourseSchedule';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export default interface CourseScheduleRepository {
  saveIfNotExistsOrThrow(param: {
    courseSchedule: CourseSchedule;
  }): Promise<void>;

  findMany(param: {
    courseId: number;
    pagination: Pagination;
  }): Promise<CourseSchedule[]>;

  findByIdOrThrow(param: {
    courseId: number;
    scheduleId: number;
  }): Promise<CourseSchedule>;

  saveIfExistsOrThrow(param: { courseSchedule: CourseSchedule }): Promise<void>;

  deleteIfExistsOrThrow(param: {
    courseId: number;
    scheduleId: number;
  }): Promise<void>;
}
