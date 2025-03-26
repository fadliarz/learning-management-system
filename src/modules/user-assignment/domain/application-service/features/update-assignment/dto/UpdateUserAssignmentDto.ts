import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AssignmentTaskType } from '../../../../../../../common/common-domain/AssignmentTaskType';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserAssignmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The course must be a string' })
  @IsNotEmpty({ message: 'The course is required' })
  @MaxLength(128, { message: 'The course must be less than 128 characters' })
  public course: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(128, { message: 'The title must be less than 128 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32, { message: 'The submission must be less than 32 characters' })
  public submission: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The deadline must be a string' })
  @IsISO8601(
    { strict: true },
    { message: 'The deadline must be a valid ISO8601 date string' },
  )
  public deadline: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  @MaxLength(512, {
    message: 'The description must be less than 512 characters',
  })
  public description: string;

  @ApiProperty({ required: false, enum: AssignmentTaskType })
  @IsOptional()
  @IsEnum(AssignmentTaskType, {
    message: 'The task type must be a valid AssignmentTaskType',
  })
  public taskType: AssignmentTaskType;
}
