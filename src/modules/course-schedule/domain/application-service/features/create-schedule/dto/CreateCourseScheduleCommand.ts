import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateCourseScheduleCommand {
  public executor: User;
  public courseId: number;
  public title: string;
  public description: string;
  public location: string;
  public startDate: Date;
  public endDate: Date;
}
