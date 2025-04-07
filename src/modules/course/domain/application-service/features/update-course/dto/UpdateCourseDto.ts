import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateCourseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code must not be empty' })
  @MaxLength(16, { message: 'Code must not be longer than 16 characters' })
  public code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  @IsNotEmpty({ message: 'Image must not be empty' })
  @MaxLength(2048, { message: 'Image must not be longer than 2048 characters' })
  public image: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  @MaxLength(128, { message: 'Title must not be longer than 128 characters' })
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(512, {
    message: 'Description must not be longer than 512 characters',
  })
  public description: string;
}
