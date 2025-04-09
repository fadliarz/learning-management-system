import { AssignmentTaskType } from '../../../../../common/common-domain/AssignmentTaskType';
import { AssignmentType } from '../../../domain/domain-core/entity/AssignmentType';
import { Expose } from 'class-transformer';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';
import { CompletionStatus } from '../../../domain/domain-core/entity/CompletionStatus';

export default class UserAssignmentEntity {
  @Expose()
  public userId: number;

  @Expose()
  public assignmentId: number;

  @Expose()
  public course: string;

  @Expose()
  public title: string;

  @Expose()
  public submission: string;

  @Expose()
  @ToISO()
  public deadline: string;

  @Expose()
  public description: string;

  @Expose()
  public taskType: AssignmentTaskType;

  @Expose()
  public assignmentType: AssignmentType;

  @Expose()
  public completionStatus: CompletionStatus;

  @Expose()
  @ToISO()
  public createdAt: string;

  @Expose()
  public classId: number;
}
