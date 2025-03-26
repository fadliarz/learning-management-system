import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class AttachmentResponse {
  @ApiProperty()
  @Expose()
  public attachmentId: number;

  @ApiProperty()
  @Expose()
  public courseId: number;

  @ApiProperty()
  @Expose()
  public lessonId: number;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty({ required: false })
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public file: string;

  @ApiProperty()
  @Expose()
  public createdAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  public updatedAt: Date;
}
