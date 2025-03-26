import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export default class CreateInstructorDto {
  @ApiProperty()
  @IsInt({ message: 'user Id must be an integer' })
  @IsPositive({ message: 'user Id must be a positive number' })
  public userId: number;
}
