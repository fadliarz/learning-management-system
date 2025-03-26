import { AssignmentTaskType } from '../../../../../common/common-domain/AssignmentTaskType';
import ToISO from '../../../../../common/common-domain/decorator/ToISO';
import { Expose } from 'class-transformer';

export default class ClassAssignmentEntity {
  @Expose()
  public assignmentId: number;

  @Expose()
  public courseId: number;

  @Expose()
  public classId: number;

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
  @ToISO()
  public createdAt: string;

  @Expose()
  @ToISO()
  public updatedAt: string;
}
