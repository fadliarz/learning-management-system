import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import WrapperResponse from '../../../../common/common-domain/WrapperResponse';
import UserScheduleResponse from '../../domain/application-service/features/common/UserScheduleResponse';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import GetUserSchedulesQueryHandler from '../../domain/application-service/features/get-schedules/GetUserSchedulesQueryHandler';
import GetUserScheduleQueryHandler from '../../domain/application-service/features/get-schedule/GetUserScheduleQueryHandler';
import { FastifyRequest } from 'fastify';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import GetUpcomingUserSchedulesQueryHandler from '../../domain/application-service/features/get-upcoming-schedules/GetUpcomingUserSchedulesQueryHandler';

@Injectable()
@Controller('api/v1/user-schedules')
@ApiTags('UserSchedule')
export default class UserScheduleController {
  constructor(
    private readonly getUserSchedulesQueryHandler: GetUserSchedulesQueryHandler,
    private readonly getUpcomingUserSchedulesQueryHandler: GetUpcomingUserSchedulesQueryHandler,
    private readonly getUserScheduleQueryHandler: GetUserScheduleQueryHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user schedules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User schedules retrieved successfully',
    type: WrapperResponse<UserScheduleResponse[]>,
  })
  public async getUserSchedules(
    @Query() query: PaginationDto,
    @Req() request: FastifyRequest,
  ): Promise<WrapperResponse<UserScheduleResponse[]>> {
    return new WrapperResponse(
      await this.getUserSchedulesQueryHandler.execute({
        executor: request.executor,
        ...query,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('upcoming')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all upcoming user schedules' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User schedules retrieved successfully',
    type: WrapperResponse<UserScheduleResponse[]>,
  })
  public async getUpcomingUserSchedules(
    @Query() query: PaginationDto,
    @Req() request: FastifyRequest,
  ): Promise<WrapperResponse<UserScheduleResponse[]>> {
    return new WrapperResponse(
      await this.getUpcomingUserSchedulesQueryHandler.execute({
        executor: request.executor,
        ...query,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('user-schedules/:scheduleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific user schedule' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User schedule retrieved successfully',
    type: WrapperResponse<UserScheduleResponse>,
  })
  public async getUserSchedule(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Req() request: FastifyRequest,
  ): Promise<WrapperResponse<UserScheduleResponse>> {
    return new WrapperResponse(
      await this.getUserScheduleQueryHandler.execute({
        executor: request.executor,
        scheduleId,
      }),
    );
  }
}
