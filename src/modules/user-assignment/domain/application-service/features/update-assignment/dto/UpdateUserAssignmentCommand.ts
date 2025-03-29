import User from '../../../../../../user/domain/domain-core/entity/User';
import { AssignmentTaskType } from '../../../../../../../common/common-domain/AssignmentTaskType';

export default class UpdateUserAssignmentCommand {
  public executor: User;
  public assignmentId: number;
  public course: string;
  public title: string;
  public submission: string;
  public deadline: string;
  public description: string;
  public taskType: AssignmentTaskType;
}
