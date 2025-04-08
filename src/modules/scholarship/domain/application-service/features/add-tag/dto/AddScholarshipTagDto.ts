import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export default class AddScholarshipTagDto {
  @ApiProperty()
  @IsInt({ message: 'tagId must be an integer' })
  public tagId: number;
}
