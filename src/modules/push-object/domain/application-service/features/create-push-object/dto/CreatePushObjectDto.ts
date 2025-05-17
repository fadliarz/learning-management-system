import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreatePushObjectDto {
  @ApiProperty()
  @IsString({ message: 'The deviceId must be a string' })
  @IsNotEmpty({ message: 'The deviceId is required' })
  @MaxLength(128, { message: 'The deviceId must be less than 128 characters' })
  public deviceId: string;

  @ApiProperty()
  @IsInt({ message: 'userId must be a number' })
  public userId: number;

  @ApiProperty()
  @IsString({ message: 'The push object must be a string' })
  @IsNotEmpty({ message: 'The push object is required' })
  @MaxLength(2056, {
    message: 'The push object must be less than 2056 characters',
  })
  public pushObjectString: string;
}
