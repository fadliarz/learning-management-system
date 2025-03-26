import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateVideoDto {
  @ApiProperty()
  @IsString({ message: 'The title must be a string' })
  @IsNotEmpty({ message: 'The title is required' })
  @MaxLength(128, { message: 'Title must be at most 128 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(512, { message: 'Description must be at most 512 characters' })
  public description: string;

  @ApiProperty()
  @IsInt({ message: 'The duration must be an integer' })
  @IsPositive({ message: 'The duration must be a positive number' })
  public durationInSec: number;

  @ApiProperty()
  @IsString({ message: 'The youtube link must be a string' })
  @IsNotEmpty({ message: 'The youtube link is required' })
  @MaxLength(128, {
    message: 'The youtube link must be at most 128 characters',
  })
  public youtubeLink: string;
}
