import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCourseScheduleDto {
  @ApiProperty()
  @IsString({ message: 'The title must be a string' })
  @IsNotEmpty({ message: 'The title is required' })
  @MaxLength(128, { message: 'The title must be less than 128 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  @MaxLength(2048, {
    message: 'The description must be less than 2048 characters',
  })
  public description: string;

  @ApiProperty()
  @IsString({ message: 'The location must be a string' })
  @IsNotEmpty({ message: 'The location is required' })
  @MaxLength(128, { message: 'The location must be less than 128 characters' })
  public location: string;

  @ApiProperty()
  @IsISO8601(
    { strict: true },
    { message: 'The deadline must be a valid ISO 8601 date' },
  )
  public startDate: Date;

  @ApiProperty()
  @IsISO8601(
    { strict: true },
    { message: 'The deadline must be a valid ISO 8601 date' },
  )
  public endDate: Date;
}
