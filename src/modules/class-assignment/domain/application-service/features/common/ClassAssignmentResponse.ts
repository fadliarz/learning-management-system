import { AssignmentTaskType } from '../../../../../../common/common-domain/AssignmentTaskType';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class ClassAssignmentResponse {
  @ApiProperty()
  @Expose()
  public assignmentId: number;

  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public classId: number;

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

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  public updatedAt: Date;
}
