import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import UpdateUserProfileDto from '../../domain/application-service/features/update-user-profile/dto/UpdateUserProfileDto';
import UpdateUserProfileCommandHandler from '../../domain/application-service/features/update-user-profile/UpdateUserProfileCommandHandler';
import CreateUserCommandHandler from '../../domain/application-service/features/create-user/CreateUserCommandHandler';
import GetMeQueryHandler from '../../domain/application-service/features/get-me/GetMeQueryHandler';
import UpdateUserPasswordCommandHandler from '../../domain/application-service/features/update-user-password/UpdateUserPasswordCommandHandler';
import UserWrapperResponse from './response/UserWrapperResponse';
import CreateUserDto from '../../domain/application-service/features/create-user/dto/CreateUserDto';
import UpdateUserPasswordDto from '../../domain/application-service/features/update-user-password/dto/UpdateUserPasswordDto';
import CookieConfig from '../../../../config/CookieConfig';
import PrivilegesWrapperResponse from '../../../privilege/application/rest/response/PrivilegesWrapperResponse';
import GetUserPrivilegesQueryHandler from '../../domain/application-service/features/get-user-privileges/GetUserPrivilegesQueryHandler';
import GetPublicUsersQueryHandler from '../../domain/application-service/features/get-public-users/GetPublicUsersQueryHandler';
import PublicUsersWrapperResponse from './response/PublicUsersWrapperResponse';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import GetUserEnrolledCoursesQueryHandler from '../../domain/application-service/features/get-user-enrolled-courses/GetUserEnrolledCoursesQueryHandler';
import CoursesWrapperResponse from '../../../course/application/rest/response/CoursesWrapperResponse';
import GetUserCalendarQueryHandler from '../../domain/application-service/features/get-user-calendar/GetUserCalendarQueryHandler';
import UserCalendarWrapperResponse from './response/UserCalendarWrapperResponse';
import GetUserCalendarRequestQueryDto from '../../domain/application-service/features/get-user-calendar/dto/GetUserCalendarRequestQueryDto';

@Injectable()
@Controller('api/v1/users')
@ApiTags('User')
export default class UserController {
  constructor(
    private readonly cookieConfig: CookieConfig,
    private readonly createUserCommandHandler: CreateUserCommandHandler,
    private readonly getMeQueryHandler: GetMeQueryHandler,
    private readonly getUserPrivilegesQueryHandler: GetUserPrivilegesQueryHandler,
    private readonly getPublicUsersQueryHandler: GetPublicUsersQueryHandler,
    private readonly getUserCalendarQueryHandler: GetUserCalendarQueryHandler,
    private readonly getUserEnrolledCoursesQueryHandler: GetUserEnrolledCoursesQueryHandler,
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
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<UserWrapperResponse> {
    const { userResponse, tokens } =
      await this.createUserCommandHandler.execute({
        ...createUserDto,
      });
    response.setCookie(this.cookieConfig.ACCESS_TOKEN_KEY, tokens.accessToken);
    response.setCookie(
      this.cookieConfig.REFRESH_TOKEN_KEY,
      tokens.refreshToken,
    );
    return new UserWrapperResponse(userResponse);
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
  @Get('privileges')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user privileges' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User privileges retrieved successfully',
    type: PrivilegesWrapperResponse,
  })
  public async getUserPrivileges(
    @Req() request: FastifyRequest,
  ): Promise<PrivilegesWrapperResponse> {
    return new PrivilegesWrapperResponse(
      await this.getUserPrivilegesQueryHandler.execute({
        executor: request.executor,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('public')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get public users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Public users retrieved successfully',
    type: PublicUsersWrapperResponse,
  })
  public async getPublicUsers(
    @Req() request: FastifyRequest,
    @Query() query: PaginationDto,
  ): Promise<PublicUsersWrapperResponse> {
    return new PublicUsersWrapperResponse(
      await this.getPublicUsersQueryHandler.execute({
        ...query,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('calendar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user calendar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User calendar retrieved successfully',
    type: PublicUsersWrapperResponse,
  })
  public async getUserCalendar(
    @Req() request: FastifyRequest,
    @Query() query: GetUserCalendarRequestQueryDto,
  ): Promise<UserCalendarWrapperResponse> {
    return new UserCalendarWrapperResponse(
      await this.getUserCalendarQueryHandler.execute({
        executor: request.executor,
        ...query,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('enrolled-courses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user enrolled courses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User enrolled courses retrieved successfully',
    type: CoursesWrapperResponse,
  })
  public async getUserEnrolledCourses(
    @Req() request: FastifyRequest,
    @Query() query: PaginationDto,
  ): Promise<CoursesWrapperResponse> {
    return new CoursesWrapperResponse(
      await this.getUserEnrolledCoursesQueryHandler.execute({
        ...query,
        executor: request.executor,
      }),
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
