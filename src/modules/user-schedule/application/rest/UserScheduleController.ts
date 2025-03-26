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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import WrapperResponse from '../../../../common/common-domain/WrapperResponse';
import UserScheduleResponse from '../../domain/application-service/features/common/UserScheduleResponse';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import GetUserSchedulesQueryHandler from '../../domain/application-service/features/get-schedules/GetUserSchedulesQueryHandler';
import GetUserScheduleQueryHandler from '../../domain/application-service/features/get-schedule/GetUserScheduleQueryHandler';
import { FastifyRequest } from 'fastify';

@Injectable()
@Controller('api/v1/user-schedules')
@ApiTags('UserSchedule')
export default class UserScheduleController {
  constructor(
    private readonly getUserSchedulesQueryHandler: GetUserSchedulesQueryHandler,
    private readonly getUserScheduleQueryHandler: GetUserScheduleQueryHandler,
  ) {}

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
