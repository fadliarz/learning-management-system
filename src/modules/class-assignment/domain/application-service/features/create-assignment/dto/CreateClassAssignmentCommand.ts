import User from '../../../../../../user/domain/domain-core/entity/User';
import { AssignmentTaskType } from '../../../../../../../common/common-domain/AssignmentTaskType';

export default class CreateClassAssignmentCommand {
  public executor: User;
  public courseId: number;
  public classId: number;
  public title: string;
  public submission: string;
  public deadline: string;
  public description: string;
  public taskType: AssignmentTaskType;
}
