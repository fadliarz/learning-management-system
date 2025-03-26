import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import UpdateUserProfileDto from '../../domain/application-service/features/update-user-profile/dto/UpdateUserProfileDto';
import UpdateUserProfileCommandHandler from '../../domain/application-service/features/update-user-profile/UpdateUserProfileCommandHandler';
import CreateUserCommandHandler from '../../domain/application-service/features/create-user/CreateUserCommandHandler';
import GetMeQueryHandler from '../../domain/application-service/features/get-me/GetMeQueryHandler';
import UpdateUserPasswordCommandHandler from '../../domain/application-service/features/update-user-password/UpdateUserPasswordCommandHandler';
import UserWrapperResponse from './response/UserWrapperResponse';
import CreateUserDto from '../../domain/application-service/features/create-user/dto/CreateUserDto';
import UpdateUserPasswordDto from '../../domain/application-service/features/update-user-password/dto/UpdateUserPasswordDto';

@Injectable()
@Controller('api/v1/users')
@ApiTags('User')
export default class UserController {
  constructor(
    private readonly createUserCommandHandler: CreateUserCommandHandler,
    private readonly getMeQueryHandler: GetMeQueryHandler,
    private readonly updateUserProfileCommandHandler: UpdateUserProfileCommandHandler,
    private readonly updateUserPasswordCommandHandler: UpdateUserPasswordCommandHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserWrapperResponse,
  })
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserWrapperResponse> {
    return new UserWrapperResponse(
      await this.createUserCommandHandler.execute({
        ...createUserDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    type: UserWrapperResponse,
  })
  public async getMe(
    @Req() request: FastifyRequest,
  ): Promise<UserWrapperResponse> {
    return new UserWrapperResponse(
      await this.getMeQueryHandler.execute({ executor: request.executor }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile updated successfully',
    type: UserWrapperResponse,
  })
  public async updateUserProfile(
    @Req() request: FastifyRequest,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserWrapperResponse> {
    return new UserWrapperResponse(
      await this.updateUserProfileCommandHandler.execute({
        executor: request.executor,
        ...updateUserProfileDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User password updated successfully',
    type: UserWrapperResponse,
  })
  public async updateUserPassword(
    @Req() request: FastifyRequest,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<UserWrapperResponse> {
    return new UserWrapperResponse(
      await this.updateUserPasswordCommandHandler.execute({
        executor: request.executor,
        ...updateUserPasswordDto,
      }),
    );
  }
}
