import ResponseItem from '../../../domain-core/entity/ResponseItem';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export default class FormSubmissionResponse {
  @ApiProperty()
  @Expose()
  public formId: string;

  @ApiProperty()
  @Expose()
  public submissionId: number;

  @ApiProperty()
  @Expose()
  public userId: number;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty()
  @Expose()
  public NIM: string;

  @ApiProperty({
    type: [ResponseItem],
  })
  @Expose()
  public responseItems: ResponseItem[];

  @ApiProperty()
  @Expose()
  public createdAt: Date;
}
