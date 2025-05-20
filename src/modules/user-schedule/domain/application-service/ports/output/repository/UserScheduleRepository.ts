import UserSchedule from '../../../../domain-core/entity/UserSchedule';
import Pagination from '../../../../../../../common/common-domain/repository/Pagination';

export interface UserScheduleRepository {
  findByIdOrThrow(param: {
    userId: number;
    scheduleId: number;
  }): Promise<UserSchedule>;

  findMany(param: {
    userId: number;
    pagination: Pagination;
    rangeQuery?: {
      id?: {
        upper?: number;
        lower?: number;
      };
    };
  }): Promise<UserSchedule[]>;
}
