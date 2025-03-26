import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateScholarshipDto {
  @ApiProperty()
  @IsString({ message: 'The image must be a string' })
  @IsNotEmpty({ message: 'The image is required' })
  @MaxLength(256, { message: 'The image must be less than 256 characters' })
  public image: string;

  @ApiProperty()
  @IsString({ message: 'The title must be a string' })
  @IsNotEmpty({ message: 'The title is required' })
  @MaxLength(128, { message: 'The title must be less than 128 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  @MaxLength(512, {
    message: 'The description must be less than 512 characters',
  })
  public description: string;

  @ApiProperty()
  @IsString({ message: 'The provider must be a string' })
  @IsNotEmpty({ message: 'The provider is required' })
  @MaxLength(64, { message: 'The provider must be less than 64 characters' })
  public provider: string;

  @ApiProperty()
  @IsString({ message: 'The deadline must be a string' })
  @IsNotEmpty({ message: 'The deadline is required' })
  @IsISO8601(
    { strict: true },
    { message: 'The deadline must be a valid ISO 8601 date' },
  )
  public deadline: string;

  @ApiProperty()
  @IsString({ message: 'The reference must be a string' })
  @IsNotEmpty({ message: 'The reference is required' })
  @MaxLength(256, { message: 'The reference must be less than 64 characters' })
  public reference: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({ message: 'The categories must be an array' })
  @ArrayMaxSize(32, { message: 'The categories must have at most 32 items' })
  @IsString({
    each: true,
    message: 'The categories must be an array of strings',
  })
  @MaxLength(32, {
    each: true,
    message: 'The categories must have at most 32 characters',
  })
  public categories: string[];
}
