import ResponseItem from '../../../../domain-core/entity/ResponseItem';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export default class CreateFormSubmissionDto {
  @IsArray({ message: 'responseItems must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ResponseItem)
  public responseItems: ResponseItem[];
}
