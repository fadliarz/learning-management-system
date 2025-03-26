import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export default class CreateCourseScheduleDto {
  @IsString({ message: 'The title must be a string' })
  @IsNotEmpty({ message: 'The title is required' })
  @MaxLength(32, { message: 'The title must be less than 32 characters' })
  public title: string;

  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  @MaxLength(512, {
    message: 'The description must be less than 512 characters',
  })
  public description: string;

  @IsString({ message: 'The location must be a string' })
  @IsNotEmpty({ message: 'The location is required' })
  @MaxLength(64, { message: 'The location must be less than 64 characters' })
  public location: string;

  @ValidateIf(
    (o: CreateCourseScheduleDto): boolean => o.endDate === undefined,
    {
      message: 'The start date is required if the end date is not provided',
    },
  )
  @IsISO8601(
    { strict: true },
    { message: 'The deadline must be a valid ISO 8601 date' },
  )
  public startDate: Date;

  @ValidateIf(
    (o: CreateCourseScheduleDto): boolean => o.startDate === undefined,
    {
      message: 'The end date is required if the start date is not provided',
    },
  )
  @IsISO8601(
    { strict: true },
    { message: 'The deadline must be a valid ISO 8601 date' },
  )
  public endDate: Date;
}
