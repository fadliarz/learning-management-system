import { AssignmentTaskType } from '../../../../../../common/common-domain/AssignmentTaskType';
import { AssignmentType } from '../../../domain-core/entity/AssignmentType';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class UserAssignmentResponse {
  @ApiProperty()
  @Expose()
  public assignmentID: number;

  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public course: string;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty()
  @Expose()
  public submission: string;

  @ApiProperty()
  @Expose()
  public deadline: Date;

  @ApiProperty({ required: false })
  @Expose()
  public description: string;

  @ApiProperty({ enum: AssignmentTaskType })
  @Expose()
  public taskType: AssignmentTaskType;

  @ApiProperty({ enum: AssignmentType })
  @Expose()
  public assignmentType: AssignmentType;

  @ApiProperty()
  @Expose()
  public createdAt: Date;
}
