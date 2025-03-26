import User from '../../../../../../user/domain/domain-core/entity/User';

export default class DeleteCourseCommand {
  executor: User;
  courseId: number;
}
