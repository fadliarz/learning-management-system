import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateScholarshipDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'image must be a string' })
  @IsNotEmpty({ message: 'image is required' })
  @MaxLength(1024, { message: 'image must be less than 1024 characters' })
  public image: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(128, { message: 'title must be less than 128 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(512, { message: 'description must be less than 512 characters' })
  public description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'provider must be a string' })
  @IsNotEmpty({ message: 'provider is required' })
  @MaxLength(64, { message: 'provider must be less than 64 characters' })
  public provider: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'The deadline must be a string' })
  @IsNotEmpty({ message: 'The deadline is required' })
  @IsISO8601(
    { strict: true },
    { message: 'The deadline must be a valid ISO 8601 date' },
  )
  public deadline: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'reference must be a string' })
  @IsNotEmpty({ message: 'referemce is required' })
  @MaxLength(256, { message: 'reference must be less than 256 characters' })
  public reference: string;
}
