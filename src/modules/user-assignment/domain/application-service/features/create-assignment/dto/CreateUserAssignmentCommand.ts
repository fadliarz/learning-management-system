import { AssignmentTaskType } from '../../../../../../../common/common-domain/AssignmentTaskType';
import User from '../../../../../../user/domain/domain-core/entity/User';

export default class CreateUserAssignmentCommand {
  public executor: User;
  public course: string;
  public title: string;
  public submission: string;
  public deadline: string;
  public description: string;
  public taskType: AssignmentTaskType;
}
