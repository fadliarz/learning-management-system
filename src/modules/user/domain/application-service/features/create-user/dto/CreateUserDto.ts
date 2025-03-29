import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidMechEngEmail } from '../../../../../../../common/common-domain/decorator/IsValidMechEngEmail';

export default class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'Avatar must be a string' })
  @IsNotEmpty({ message: 'Avatar must not be empty' })
  public avatar: string;

  @ApiProperty({
    description: 'User email (must be a valid email)',
    example: '13121140@mahasiswa.itb.ac.id',
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsValidMechEngEmail()
  public email: string;

  @ApiProperty({
    description: 'User password (8-128 characters)',
    example: 'securePassword123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must be at most 128 characters long' })
  public password: string;

  @ApiProperty({
    description: 'Phone number (8-16 characters)',
    example: '+6281234567890',
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number must not be empty' })
  @MinLength(8, { message: 'Phone number must be at least 8 characters long' })
  @MaxLength(16, { message: 'Phone number must be at most 16 characters long' })
  public phoneNumber: string;

  @ApiProperty({
    description: 'Full name of user',
    example: 'Muhammad Fadli',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  @MaxLength(128, { message: 'Name must be at most 128 characters long' })
  public name: string;

  @ApiProperty({
    required: false,
    description: 'User bio/about information',
    example: 'Engineering student with interest in Machine Learniing',
  })
  @IsOptional()
  @IsString({ message: 'About must be a string' })
  @MaxLength(1024, { message: 'About must be at most 1024 characters long' })
  public about: string;

  @ApiProperty({
    description: 'Date of birth in ISO8601 format',
    example: '2003-04-15',
  })
  @IsString({ message: 'Date of birth must be a string' })
  @IsISO8601(
    { strict: true },
    { message: 'Date of birth must be in ISO8601 format' },
  )
  public dateOfBirth: string;

  @ApiProperty({
    description: 'User address (8-128 characters)',
    example: '123 Engineering Street, City',
  })
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address must not be empty' })
  @MinLength(8, { message: 'Address must be at least 8 characters long' })
  @MaxLength(128, { message: 'Address must be at most 128 characters long' })
  public address: string;

  @ApiProperty({
    description: 'Blood type',
    example: 'A',
    enum: ['A', 'B', 'O', 'AB'],
  })
  @IsString({ message: 'Blood type must be a string' })
  @IsIn(['A', 'B', 'O', 'AB'], {
    message: 'Blood type must be one of A, B, O, AB',
  })
  public bloodType: string;

  @ApiProperty({
    description: 'List of medical history items',
    type: [String],
    example: ['Asthma', 'Allergy'],
  })
  @IsArray({ message: 'Medical histories must be an array' })
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: 'Medical histories must be at most 10 items' })
  public medicalHistories: string[];

  @ApiProperty({
    description: 'List of enrolled student unit IDs',
    type: [String],
    example: ['UNIT001', 'UNIT002'],
  })
  @IsArray({ message: 'Enrolled student units must be an array' })
  @IsString({ each: true })
  @ArrayMaxSize(10, {
    message: 'Enrolled student units must be at most 10 items',
  })
  public enrolledStudentUnits: string[];

  @ApiProperty({
    description: 'List of user hobbies',
    type: [String],
    example: ['Reading', 'Coding'],
  })
  @IsArray({ message: 'Hobbies must be an array' })
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: 'Hobbies must be at most 10 items' })
  public hobbies: string[];

  @ApiProperty({
    description: 'LINE messaging app ID',
    example: 'user_line_id',
  })
  @IsString({ message: 'Line ID must be a string' })
  @IsNotEmpty({ message: 'Line ID must not be empty' })
  @MaxLength(128, { message: 'Line ID must be at most 128 characters long' })
  public lineId: string;

  @ApiProperty({
    description: 'Emergency contact number (8-16 characters)',
    example: '+6287654321098',
  })
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
