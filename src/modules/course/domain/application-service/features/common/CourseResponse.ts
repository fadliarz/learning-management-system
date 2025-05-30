import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import CategoryResponse from '../../../../../category/domain/application-service/features/common/CategoryResponse';

export default class CourseResponse {
  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public code: string;

  @ApiProperty()
  @Expose()
  public image: string;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty({ required: false })
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public numberOfStudents: number;

  @ApiProperty()
  @Expose()
  public numberOfInstructors: number;

  @ApiProperty()
  @Expose()
  public numberOfClasses: number;

  @ApiProperty()
  @Expose()
  public numberOfAssignments: number;

  @ApiProperty()
  @Expose()
  public numberOfLessons: number;

  @ApiProperty()
  @Expose()
  public numberOfVideos: number;

  @ApiProperty()
  @Expose()
  public numberOfDurations: number;

  @ApiProperty()
  @Expose()
  public numberOfAttachments: number;

  @ApiProperty({
    type: [CategoryResponse],
  })
  @Expose()
  public categories: CategoryResponse[];

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  public updatedAt: Date;
}
