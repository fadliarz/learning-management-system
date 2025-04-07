import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export default class AddCourseCategoryDto {
  @ApiProperty()
  @IsInt({ message: 'categoryId must be an integer' })
  public categoryId: number;
}
