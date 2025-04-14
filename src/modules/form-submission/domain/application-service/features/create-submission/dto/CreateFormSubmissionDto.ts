import ResponseItem from '../../../../domain-core/entity/ResponseItem';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateFormSubmissionDto {
  @ApiProperty({
    type: [ResponseItem],
  })
  @IsArray({ message: 'responseItems must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ResponseItem)
  public responseItems: ResponseItem[];
}
