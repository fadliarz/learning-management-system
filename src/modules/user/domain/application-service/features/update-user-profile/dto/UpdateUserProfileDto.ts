import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import ISO8601ToDate from '../../../../../../../common/common-domain/decorator/ISO8601ToDate';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number must not be empty' })
  @MinLength(8, { message: 'Phone number must be at least 8 characters long' })
  @MaxLength(16, { message: 'Phone number must be at most 16 characters long' })
  public phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'About must be a string' })
  @MaxLength(1024, { message: 'About must be at most 1024 characters long' })
  public about: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ISO8601ToDate()
  public dateOfBirth: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address must not be empty' })
  @MinLength(8, { message: 'Address must be at least 8 characters long' })
  @MaxLength(128, { message: 'Address must be at most 128 characters long' })
  public address: string;

  @ApiProperty({
    required: false,
    enum: ['A', 'B', 'O', 'AB'],
  })
  @IsOptional()
  @IsString({ message: 'Blood type must be a string' })
  @IsIn(['A', 'B', 'O', 'AB'], {
    message: 'Blood type must be one of A, B, O, AB',
  })
  public bloodType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({ message: 'Medical histories must be an array' })
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: 'Medical histories must be at most 10 items' })
  public medicalHistories: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({ message: 'Enrolled student units must be an array' })
  @IsString({ each: true })
  @ArrayMaxSize(10, {
    message: 'Enrolled student units must be at most 10 items',
  })
  public enrolledStudentUnits: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray({ message: 'Hobbies must be an array' })
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: 'Hobbies must be at most 10 items' })
  public hobbies: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Line ID must be a string' })
  @IsNotEmpty({ message: 'Line ID must not be empty' })
  @MaxLength(128, { message: 'Line ID must be at most 128 characters long' })
  public lineId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Emergency number must be a string' })
  @IsNotEmpty({ message: 'Emergency number must not be empty' })
  @MinLength(8, {
    message: 'Emergency number must be at least 8 characters long',
  })
  @MaxLength(16, {
    message: 'Emergency number must be at most 16 characters long',
  })
  public emergencyNumber: string;
}
