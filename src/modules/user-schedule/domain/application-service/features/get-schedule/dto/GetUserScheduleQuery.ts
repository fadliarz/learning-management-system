import User from '../../../../../../user/domain/domain-core/entity/User';

export default class GetUserScheduleQuery {
  public executor: User;
  public scheduleId: number;
}
