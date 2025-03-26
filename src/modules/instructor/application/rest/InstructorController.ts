import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateInstructorCommandHandler from '../../domain/application-service/features/create-instructor/CreateInstructorCommandHandler';
import GetInstructorsQueryHandler from '../../domain/application-service/features/get-instructors/GetInstructorsQueryHandler';
import { AuthenticationGuard } from '../../../authentication/domain/application-service/AuthenticationGuard';
import { FastifyRequest } from 'fastify';
import CreateInstructorDto from '../../domain/application-service/features/create-instructor/dto/CreateInstructorDto';
import InstructorWrapperResponse from './response/InstructorWrapperResponse';
import PaginationDto from '../../../../common/common-domain/PaginationDto';
import InstructorsWrapperResponse from './response/InstructorsWrapperResponse';
import DeleteInstructorCommandHandler from '../../domain/application-service/features/delete-instructor/DeleteInstructorCommandHandler';

@ApiTags('Instructor')
@Controller('api/v1')
export default class InstructorController {
  constructor(
    private readonly createInstructorCommandHandler: CreateInstructorCommandHandler,
    private readonly getInstructorsQueryHandler: GetInstructorsQueryHandler,
    private readonly deleteInstructorCommandHandler: DeleteInstructorCommandHandler,
  ) {}

  @UseGuards(AuthenticationGuard)
  @Post('courses/:courseId/classes/:classId/instructors')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create instructor' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Instructor created successfully',
    type: InstructorWrapperResponse,
  })
  public async createInstructor(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Req() request: FastifyRequest,
    @Body() createInstructorDto: CreateInstructorDto,
  ): Promise<InstructorWrapperResponse> {
    return new InstructorWrapperResponse(
      await this.createInstructorCommandHandler.execute({
        executor: request.executor,
        courseId,
        classId,
        ...createInstructorDto,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('courses/:courseId/classes/:classId/instructors')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get instructors by course ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of instructors retrieved successfully',
    type: InstructorsWrapperResponse,
  })
  public async getInstructors(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query() query: PaginationDto,
    @Req() request: FastifyRequest,
  ): Promise<InstructorsWrapperResponse> {
    return new InstructorsWrapperResponse(
      await this.getInstructorsQueryHandler.getInstructors({
        executor: request.executor,
        classId,
        courseId,
        ...query,
      }),
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('courses/:courseId/classes/:classId/instructors/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete instructor' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Instructor delete successfully',
  })
  public async deleteInstructor(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    await this.deleteInstructorCommandHandler.execute({
      executor: request.executor,
      courseId,
      classId,
      userId,
    });
  }
}
