import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class VideoResponse {
  @ApiProperty()
  @Expose()
  public videoId: number;

  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public lessonId: number;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty({ required: false })
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public durationInSec: number;

  @ApiProperty()
  @Expose()
  public youtubeLink: string;

  @ApiProperty()
  @Expose()
  public position: number;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  public updatedAt: Date;
}
