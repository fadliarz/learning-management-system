import { AssignmentTaskType } from '../../../../../../../common/common-domain/AssignmentTaskType';
import User from '../../../../../../user/domain/domain-core/entity/User';

export default class UpdateClassAssignmentCommand {
  public executor: User;
  public assignmentId: number;
  public classId: number;
  public title: string;
  public submission: string;
  public deadline: string;
  public description: string;
  public taskType: AssignmentTaskType;
}
