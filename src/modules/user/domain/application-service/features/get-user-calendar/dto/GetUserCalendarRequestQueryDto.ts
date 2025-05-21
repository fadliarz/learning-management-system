import PaginationDto from '../../../../../../../common/common-domain/PaginationDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export default class GetUserCalendarRequestQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'month must be an integer' })
  @IsPositive({ message: 'month must be greater than 0' })
  public month: number;
}
