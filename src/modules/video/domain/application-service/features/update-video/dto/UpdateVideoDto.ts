import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export default class UpdateVideoDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  public title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  public description: string;

  @IsOptional()
  @IsString({ message: 'YoutubeLink must be a string' })
  @IsNotEmpty({ message: 'YoutubeLink must not be empty' })
  public youtubeLink: string;

  @IsOptional()
  @IsInt({ message: 'DurationInSec must be an integer' })
  @IsPositive({ message: 'DurationInSec must be a positive number' })
  public durationInSec: number;
}
