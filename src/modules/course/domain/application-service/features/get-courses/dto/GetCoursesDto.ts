import { ArrayMaxSize, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import PaginationDto from '../../../../../../../common/common-domain/PaginationDto';

export default class GetCoursesDto extends PaginationDto {
  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsInt({ each: true, message: 'Each category must be an integer' })
  @IsPositive({
    each: true,
    message: 'Each category must be a positive number',
  })
  @ArrayMaxSize(32, { message: 'Category array must have at most 32 elements' })
  public categories: number[];
}
