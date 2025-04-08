import { ArrayMaxSize, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import PaginationDto from '../../../../../../../common/common-domain/PaginationDto';

export default class GetScholarshipsDto extends PaginationDto {
  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsInt({ each: true, message: 'Each tag must be an integer' })
  @IsPositive({
    each: true,
    message: 'Each tag must be a positive number',
  })
  @ArrayMaxSize(32, { message: 'Tag array must have at most 32 elements' })
  public tags: number[];
}
