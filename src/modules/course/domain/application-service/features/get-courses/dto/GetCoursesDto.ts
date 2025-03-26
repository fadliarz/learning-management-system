import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';
import PaginationDto from '../../../../../../../common/common-domain/PaginationDto';
import { ApiProperty } from '@nestjs/swagger';

export default class GetCoursesDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({ each: true, message: 'Category must be an array' })
  @IsString({ each: true, message: 'Each category must be a string' })
  @ArrayMaxSize(32, { message: 'Category array must have at most 32 elements' })
  public categories: string[];
}
