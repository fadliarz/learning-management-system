import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'last evaluated Id must be an integer' })
  @IsPositive({ message: 'last evaluated Id must be greater than 0' })
  public lastEvaluatedId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @IsPositive({ message: 'limit must be greater than 0' })
  public limit: number;
}
