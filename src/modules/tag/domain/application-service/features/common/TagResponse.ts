import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class TagResponse {
  @ApiProperty()
  @Expose()
  public tagId: number;

  @ApiProperty()
  @Expose()
  public title: string;
}
