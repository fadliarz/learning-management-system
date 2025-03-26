import DomainException from '../../../../../../../common/common-domain/exception/DomainException';
import UserSchedule from '../../../../domain-core/entity/UserSchedule';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface UserScheduleRepository {
  findByIdOrThrow(param: {
    userId: number;
    scheduleId: number;
    domainException: DomainException;
  }): Promise<UserSchedule>;

  findMany(param: {
    userId: number;
    pagination: Pagination;
  }): Promise<UserSchedule[]>;
}
