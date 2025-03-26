import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class LessonResponse {
  @ApiProperty()
  @Expose()
  public lessonId: number;

  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty({ required: false })
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public numberOfVideos: number;

  @ApiProperty()
  @Expose()
  public numberOfDurations: number;

  @ApiProperty()
  @Expose()
  public numberOfAttachments: number;

  @ApiProperty()
  @Expose()
  public position: number;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  public updatedAt: Date;

  @ApiProperty()
  @Expose()
  public videoPositionVersion: number;
}
