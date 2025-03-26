import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class CategoryResponse {
  @ApiProperty()
  @Expose()
  public categoryId: number;

  @ApiProperty()
  @Expose()
  public title: string;
}
