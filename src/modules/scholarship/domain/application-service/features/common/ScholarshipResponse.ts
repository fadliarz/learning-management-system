import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class ScholarshipResponse {
  @ApiProperty()
  @Expose()
  public scholarshipId: number;

  @ApiProperty()
  @Expose()
  public title: string;

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

  @ApiProperty()
  @Expose()
  public categories: string[];
}
