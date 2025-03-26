import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import CourseScheduleWrapperResponse from './response/CourseScheduleWrapperResponse';
import CreateCourseScheduleDto from '../../domain/application-service/features/create-schedule/dto/CreateCourseScheduleDto';
import CreateCourseScheduleCommandHandler from '../../domain/application-service/features/create-schedule/CreateCourseScheduleCommandHandler';
import GetCourseScheduleQueryHandler from '../../domain/application-service/features/get-schedule/GetCourseScheduleQueryHandler';
import UpdateCourseScheduleCommandHandler from '../../domain/application-service/features/update-schedule/UpdateCourseScheduleCommandHandler';
import UpdateCourseScheduleDto from '../../domain/application-service/features/update-schedule/dto/UpdateCourseScheduleDto';
import CourseSchedulesWrapperResponse from './response/CourseSchedulesWrapperResponse';
import GetCourseSchedulesQueryHandler from '../../domain/application-service/features/get-schedules/GetCourseSchedulesQueryHandler';
import DeleteCourseScheduleCommandHandler from '../../domain/application-service/features/delete-schedule/DeleteCourseScheduleCommandHandler';

@Injectable()
@Controller('api/v1')
@ApiTags('CourseSchedule')
export default class CourseScheduleController {
  constructor(
    private readonly createCourseScheduleCommandHandler: CreateCourseScheduleCommandHandler,
    private readonly getCourseSchedulesQueryHandler: GetCourseSchedulesQueryHandler,
    private readonly getCourseScheduleQueryHandler: GetCourseScheduleQueryHandler,
    private readonly updateCourseScheduleCommandHandler: UpdateCourseScheduleCommandHandler,
    private readonly deleteCourseScheduleCommandHandler: DeleteCourseScheduleCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('courses/:courseId/schedules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a schedule for a course' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Course schedule created successfully.',
    type: CourseScheduleWrapperResponse,
  })
  public async createCourseSchedule(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Req() request: FastifyRequest,
    @Body() createCourseScheduleDto: CreateCourseScheduleDto,
  ): Promise<CourseScheduleWrapperResponse> {
    return new CourseScheduleWrapperResponse(
      await this.createCourseScheduleCommandHandler.execute({
        executor: request.executor,
        courseId,
        ...createCourseScheduleDto,
      }),
    );
  }

  @Get('courses/:courseId/schedules')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all schedules for a course' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course schedules retrieved successfully',
    type: CourseSchedulesWrapperResponse,
  })
  public async getCourseSchedules(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Query() query: PaginationDto,
  ): Promise<CourseSchedulesWrapperResponse> {
    return new CourseSchedulesWrapperResponse(
      await this.getCourseSchedulesQueryHandler.execute({
        courseId,
        ...query,
      }),
    );
  }

  @Get('courses/:courseId/schedules/:scheduleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific course schedule' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course schedule retrieved successfully',
    type: CourseSchedulesWrapperResponse,
  })
  public async getCourseSchedule(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<CourseScheduleWrapperResponse> {
    return new CourseScheduleWrapperResponse(
      await this.getCourseScheduleQueryHandler.execute({
        scheduleId,
        courseId,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('courses/:courseId/schedules/:scheduleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a course schedule' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course schedule updated successfully',
    type: CourseScheduleWrapperResponse,
  })
  public async updateCourseSchedule(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Req() request: FastifyRequest,
    @Body() updateCourseScheduleDto: UpdateCourseScheduleDto,
  ): Promise<CourseScheduleWrapperResponse> {
    return new CourseScheduleWrapperResponse(
      await this.updateCourseScheduleCommandHandler.execute({
        executor: request.executor,
        scheduleId,
        courseId,
        ...updateCourseScheduleDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('courses/:courseId/schedules/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a course schedule' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Course schedule deleted successfully',
  })
  public async deleteCourseSchedule(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteCourseScheduleCommandHandler.execute({
      executor: request.executor,
      scheduleId,
      courseId,
    });
  }
}
