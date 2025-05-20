import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import TagResponse from '../../../../../tag/domain/application-service/features/common/TagResponse';

export default class ScholarshipResponse {
  @ApiProperty()
  @Expose()
  public scholarshipId: number;

  @ApiProperty()
  @Expose()
  public title: string;

  @ApiProperty()
  @Expose()
  public image: string;

  @ApiProperty({ required: false })
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose()
  public provider: string;

  @ApiProperty()
  @Expose()
  public deadline: Date;

  @ApiProperty()
  @Expose()
  public reference: string;

  @ApiProperty({ type: [TagResponse] })
  @Expose()
  public tags: TagResponse[];
}
